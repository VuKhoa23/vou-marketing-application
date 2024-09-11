import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Text, Box, chakra, Flex, Heading } from "@chakra-ui/react";
import Lottie from "react-lottie";
import animation from "./lotties/man-holding-tablet";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

function TriviaGame() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const accessToken = useSelector((state) => state.auth.accessToken);
    const user = useSelector((state) => state.user);
    const currentEvent = useSelector((state) => state.currentEvent);

    const [gameId, setGameId] = useState(null);
    const [gameEnd, setGameEnd] = useState(false);

    const [script, setScript] = useState("");
    const [answers, setAnswers] = useState([]);
    const [answered, setAnswered] = useState(false);

    const [seconds, setSeconds] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

    const scoreRef = useRef(score);

    useEffect(() => {
        scoreRef.current = score;
    }, [score]);

    const animOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    useEffect(() => {
        async function fetchGameId() {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_URL}/api/brand/game/get-game/by-event/${eventId}`
                );

                if (response.ok) {
                    const data = await response.json();
                    setGameId(data[0].id);
                } else {
                    console.error("Error fetching game ID:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Error fetching game ID:", error);
            }
        }

        fetchGameId();
    }, [currentEvent, eventId, navigate]);

    useEffect(() => {
        if (gameId) {
            const ws = new WebSocket(`ws://localhost/ws?gameId=${gameId}&instant=true`);

            ws.onopen = () => {
                console.log("Connected to the WebSocket server");
                setScript("Bạn vui lòng chờ một chút nhé!");
            };

            ws.onmessage = (event) => {
                try {
                    const parsedData = JSON.parse(event.data);

                    if (parsedData.code === "GAME_NEARLY_READY") {
                        setScript("Trò chơi sẽ sớm bắt đầu!");
                        setSeconds(5);
                    } else if (parsedData.code === "GAME_ENDED") {
                        setAnswered(false);
                        setAnswers([]);
                        setGameEnd(true);
                        setScript("Cảm ơn bạn đã tham gia!");
                        handleGameEnd(scoreRef.current);
                    } else {
                        setScript(parsedData.title);
                        setAnswers(parsedData.answers);
                        setAnswered(false);
                        setSeconds(15);
                        setSelectedAnswerIndex(null);
                    }
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            };

            ws.onclose = (event) => {
                console.log("WebSocket connection closed:", event.reason);
                setScript("Bạn đã bị mất kết nối với VOU. Hãy thử lại sau nhé.");
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            return () => {
                ws.close();
            };
        } else {
            setScript("Đã có lỗi xảy ra với game này. Hãy thử lại sau nhé.");
        }
    }, [gameId]);

    useEffect(() => {
        if (seconds === 0) return;

        const timerInterval = setInterval(() => {
            setSeconds((prevTime) => prevTime - 1);
        }, 1000);

        return () => {
            clearInterval(timerInterval);
        };
    }, [seconds]);

    const handleAnswer = (answerIndex) => {
        if (!answered) {
            setSelectedAnswerIndex(answerIndex);
            const correctAnswerIndex = answers.findIndex((answer) => answer.truthy);

            if (answerIndex === correctAnswerIndex) {
                setScript(`Chính xác!`);
                setScore(score + 40);
                setAnswers([]);
            } else {
                setScript(
                    `Thật đáng tiếc, câu trả lời đúng là "${answers[correctAnswerIndex].content}".`
                );
            }

            setAnswered(true);
        }
    };

    return (
        <ProtectedRoute>
            <div className="m-10">
                <Toaster />
                <Heading as="h4" size="lg" textAlign="center" my={4}>
                    Sự kiện {currentEvent.name} của thương hiệu {currentEvent.brandName}
                </Heading>
                <div className="flex">
                    {gameEnd === false ? (
                        <div className="flex-col w-1/5 mr-10">
                            <Box
                                w="100%"
                                height="inherit"
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow="md"
                                p={6}
                                marginBottom="auto"
                                marginTop={"5"}
                            >
                                <Text fontSize="4xl" fontWeight="semibold" align="center">
                                    {seconds}
                                </Text>
                            </Box>
                            <Box
                                w="100%"
                                height="inherit"
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                boxShadow="md"
                                p={6}
                                marginBottom="auto"
                                marginTop={"5"}
                            >
                                <div className="flex justify-center">
                                    <Text
                                        fontSize="3xl"
                                        fontWeight="semibold"
                                        mr={4}
                                        align="center"
                                    >
                                        {score}
                                    </Text>
                                    <img
                                        src="/coin-svgrepo-com.svg"
                                        alt="coin"
                                        height="24"
                                        width="24"
                                    />
                                </div>
                            </Box>
                        </div>
                    ) : (
                        <></>
                    )}

                    <Box
                        minW="45%"
                        maxW="45%"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="md"
                        p={6}
                        margin="auto"
                        marginTop={"5"}
                    >
                        {answered ? (
                            <Text fontSize="xl" fontWeight="bold">
                                Vui lòng chờ câu hỏi tiếp theo...
                            </Text>
                        ) : answers.length > 0 ? (
                            <Flex direction="column">
                                {answers.map((answer, index) => (
                                    <Button
                                        key={index}
                                        my={2}
                                        variant="outline"
                                        isDisabled={
                                            selectedAnswerIndex !== null &&
                                            selectedAnswerIndex !== index
                                        }
                                        onClick={() => handleAnswer(index)}
                                        value={answer}
                                    >
                                        <chakra.span
                                            dangerouslySetInnerHTML={{ __html: answer.content }}
                                        />
                                    </Button>
                                ))}
                            </Flex>
                        ) : gameEnd === true ? (
                            <div>
                                <Text fontSize="xl" fontWeight="bold">
                                    Trò chơi đã kết thúc! Bạn giành được
                                </Text>
                                <Text fontSize="xl" fontWeight="bold" color="#008000">
                                    {score} xu
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    tương đương với
                                </Text>
                                <Text fontSize="xl" fontWeight="bold" color="#008000">
                                    {Math.floor(score / 50)} voucher
                                </Text>
                                <Text fontSize="xl" fontWeight="bold">
                                    Voucher sẽ tự động được đổi và lưu vào tài khoản của bạn.
                                </Text>
                            </div>
                        ) : (
                            <Text fontSize="xl" fontWeight="bold">
                                Đang chuẩn bị trò chơi...
                            </Text>
                        )}
                    </Box>
                    <Box
                        w="30%"
                        height="inherit"
                        borderWidth="1px"
                        borderRadius="lg"
                        overflow="hidden"
                        boxShadow="md"
                        p={6}
                        marginLeft={12}
                        marginBottom="auto"
                        marginTop={"5"}
                    >
                        <Text fontSize="xl" fontWeight="bold">
                            {script}
                        </Text>
                    </Box>
                    <Lottie options={animOptions} height={400} width={300} />
                </div>
            </div>
        </ProtectedRoute>
    );

    async function handleGameEnd(score) {
        try {
            fetch("http://localhost/api/user/add-coin", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + accessToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventId: parseInt(eventId), coin: score }),
            })
                .then((response) => {
                    if (!response.ok) {
                        toast.error("Lỗi gửi dữ liệu xu về máy chủ.");
                        throw new Error("Error sending coin data");
                    }
                })
                .then(() => {
                    fetch("http://localhost/api/user/exchange-voucher", {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer " + accessToken,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            voucherId: currentEvent.voucherId,
                            voucherQuantities: Math.floor(score / 50),
                            coin: 50,
                            eventId: parseInt(eventId),
                        }),
                    });
                })
                .then((response) => {
                    if (!response.ok) {
                        toast.error("Lỗi đổi voucher từ máy chủ.");
                        throw new Error("Error exchanging vouchers");
                    }

                    toast.success("Voucher đã được đổi thành công.");
                    console.log("Game finalized.");
                })
                .catch((error) => {
                    console.log("Error finalizing game: " + error);
                });
        } catch (error) {
            console.log("Error finalizing game: " + error);
        }
    }
}

export default TriviaGame;
