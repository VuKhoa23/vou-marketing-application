import React, { useState, useEffect } from "react";
import { Button, Text, Box, chakra, Flex, useToast, Heading } from "@chakra-ui/react";
import Lottie from "react-lottie";
import animation from "./lotties/man-holding-tablet";

function TriviaGame({ gameId, eventName }) {
    const [gameEnd, setGameEnd] = useState(false);

    const [script, setScript] = useState("");
    const [answers, setAnswers] = useState([]);
    const [answered, setAnswered] = useState(false);

    const [seconds, setSeconds] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

    const animOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost/ws?gameId=66d80adbf4dea4981787bf0c&instant=true`);

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
                setScript(`Câu trả lời đúng là ${answers[correctAnswerIndex].content}`);
            }

            setAnswered(true);
        }
    };

    return (
        <div className="m-10">
            <Heading as="h4" size="lg" textAlign="center" my={4}>
                Sự kiện: Sự kiện của Grab
            </Heading>
            <div className="flex">
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
                            <Text fontSize="3xl" fontWeight="semibold" mr={4} align="center">
                                {score}
                            </Text>
                            <img src="/coin-svgrepo-com.svg" alt="coin" height="24" width="24" />
                        </div>
                    </Box>
                </div>
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
                        <Text fontSize="xl" fontWeight="bold">
                            Trò chơi đã kết thúc.
                        </Text>
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
    );
}

export default TriviaGame;
