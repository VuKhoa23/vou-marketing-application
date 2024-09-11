import {
  Flex, Box, Table, Tbody, Td, Text, Th, Thead, Tr, Button, Input,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
  FormControl, FormErrorMessage, FormLabel, InputGroup, InputRightElement, Icon,
  VStack, Checkbox, useToast
} from '@chakra-ui/react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { CalendarIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents, updateEvent } from '../../../store/slices/eventsSlice';


const columnHelper = createColumnHelper();

export default function EventList() {
  const [sorting, setSorting] = React.useState([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [voucherModalData, setVoucherModalData] = React.useState(null);
  const [newQuantity, setNewQuantity] = React.useState(0);
  const [totalQuantity, setTotalQuantity] = React.useState(0);
  const [error, setError] = React.useState('');
  const voucherModalDisclosure = useDisclosure();
  const eventModalDisclosure = useDisclosure();
  const [eventModalData, setEventModalData] = React.useState({
    id: '',
    name: '',
    startDate: null,
    endDate: null,
    isShaking: false,
    isTrivia: false,
  });


  const textColor = 'black';
  const borderColor = 'gray.200';


  const [errors, setErrors] = React.useState({
    name: '',
    startDate: '',
    endDate: '',
    gameType: '',
  });
  const toast = useToast();
  const dispatch = useDispatch();
  const brandId = useSelector(state => state.brand.id);
  const tableData = useSelector(state => state.events);

  useEffect(() => {
    async function fetchEvents(brandId) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/event/events-and-vouchers?brandId=${brandId}`);
      if (response.ok) {
        const apiData = await response.json();
        const transformedData = transformData(apiData);
        dispatch(setEvents(transformedData));
      }
    }
    // if (tableData.length <= 0) {
    //   fetchEvents();
    // }

    fetchEvents(brandId);
  }, [brandId]);

  function handleInputChange(identifier, value) {
    // Dispatch the update to Redux store
    setEventModalData({
      ...eventModalData,
      [identifier]: value
    });

    setErrors(prevErrors => ({
      ...prevErrors,
      [identifier]: ''
    }));

    // Validation
    if (identifier === 'startDate' && value && eventModalData.endDate && new Date(value) > new Date(eventModalData.endDate)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        startDate: 'Ngày bắt đầu không thể sau ngày kết thúc.'
      }));
    }
    if (identifier === 'endDate' && value && eventModalData.startDate && new Date(value) < new Date(eventModalData.startDate)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        endDate: 'Ngày kết thúc không thể trước ngày bắt đầu.'
      }));
    }

  }


  function validateField(identifier) {
    const value = eventModalData[identifier];
    let errorMessage = '';

    switch (identifier) {
      case 'name':
        if (!value) {
          errorMessage = 'Tên sự kiện không được bỏ trống.';
        }
        break;
      case 'startDate':
        if (!value) {
          errorMessage = 'Ngày bắt đầu không được bỏ trống.';
        } else if (eventModalData.endDate && new Date(value) > new Date(eventModalData.endDate)) {
          errorMessage = 'Ngày bắt đầu không thể sau ngày kết thúc.';
        }
        break;
      case 'endDate':
        if (!value) {
          errorMessage = 'Ngày kết thúc không được bỏ trống.';
        } else if (eventModalData.startDate && new Date(value) < new Date(eventModalData.startDate)) {
          errorMessage = 'Ngày kết thúc không thể trước ngày bắt đầu.';
        }
        break;
      case 'gameType':
        if (!value) {
          errorMessage = 'Bạn phải chọn loại trò chơi.';
        }
        break;
      default:
        break;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [identifier]: errorMessage
    }));
  }

  function handleGameTypeChange(type, checked) {
    setEventModalData(prevData => ({
      ...prevData,
      [type]: checked
    }));
  }
  function parseGameType(gameType) {
    return {
      isShaking: gameType.includes('Lắc xu'),
      isTrivia: gameType.includes('Trivia'),
    };
  }

  function updateEventModalDataFromGameType(gameType) {
    const { isShaking, isTrivia } = parseGameType(gameType);
    setEventModalData(prevData => ({
      ...prevData,
      isShaking: isShaking,
      isTrivia: isTrivia,
    }));
  }

  const CustomInput = React.forwardRef(({ value, onClick, onBlur }, ref) => (
    <InputGroup>
      <InputRightElement pointerEvents="none">
        <Icon as={CalendarIcon} color="gray.500" />
      </InputRightElement>
      <Input
        ref={ref}
        value={value}
        onClick={onClick}
        onBlur={onBlur}
        placeholder="Chọn ngày"
        readOnly
      />
    </InputGroup>
  ));

  const columns = [
    columnHelper.accessor('id', {
      id: 'id',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          ID
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('name', {
      id: 'name',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          TÊN SỰ KIỆN
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700" whiteSpace="normal"
          overflowWrap="break-word"
          wordBreak="break-word"
          maxWidth="200px"
        >
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('gameType', {
      id: 'gameType',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          Loại trò chơi
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    // columnHelper.accessor('participants', {
    //   id: 'participants',
    //   header: () => (
    //     <Text
    //       justifyContent="space-between"
    //       align="center"
    //       fontSize={{ sm: '10px', lg: '12px' }}
    //       color="gray.400"
    //     >
    //       SỐ LƯỢNG NGƯỜI THAM GIA
    //     </Text>
    //   ),
    //   cell: (info) => (
    //     <Text color={textColor} fontSize="sm" fontWeight="700">
    //       {/* {info.getValue()} */}
    //       {2}
    //     </Text>
    //   ),
    // }),
    columnHelper.accessor('quantity', {
      id: 'quantity',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          SỐ LƯỢNG VOUCHER
        </Text>
      ),
      cell: (info) => (
        <Flex align="center" className="space-x-2">
          <div className="flex-1 flex items-center">
            <Text color={textColor} fontSize="sm" fontWeight="700">
              {info.getValue()}
            </Text>
          </div>
          <Button
            colorScheme="gray"
            size="sm"
            onClick={() => {
              setVoucherModalData({
                id: info.row.original.id,
                name: info.row.original.name,
                quantity: info.getValue(),
              });
              setTotalQuantity(info.getValue());
              setNewQuantity('');
              voucherModalDisclosure.onOpen();
            }}
          >
            +
          </Button>
        </Flex>
      ),
    }),
    columnHelper.accessor('startDate', {
      id: 'startDate',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          NGÀY BẮT ĐẦU
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('endDate', {
      id: 'endDate',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          NGÀY KẾT THÚC
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
    columnHelper.accessor('manipulate', {
      id: 'manipulate',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          THAO TÁC
        </Text>
      ),
      cell: (info) => (
        <Button
          colorScheme="gray"
          size="md"
          fontWeight="700"
          onClick={() => {
            updateEventModalDataFromGameType(info.row.original.gameType);
            setEventModalData(prevData => ({
              ...prevData,
              id: info.row.original.id,
              name: info.row.original.name,
              startDate: new Date(info.row.original.startDate.split("-").reverse().join("-")),
              endDate: new Date(info.row.original.endDate.split("-").reverse().join("-")),
            }));
            eventModalDisclosure.onOpen();
          }}
        >
          Chỉnh sửa
        </Button>
      ),
    }),
  ];

  useEffect(() => {
    setData([...tableData]);
  }, [tableData]);

  const [data, setData] = React.useState(() => [...tableData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination: { pageIndex, pageSize }
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const totalPages = Math.ceil(table.getPreFilteredRowModel().rows.length / pageSize);

  const handleNextPage = () => {
    setPageIndex((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePreviousPage = () => {
    setPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setError('');
    setNewQuantity(value);
    setTotalQuantity(voucherModalData.quantity + Number(value));
  };

  const handleClose = (modalType) => {
    setError('');
    setErrors('');
    const closeFunction = modalType === 'voucher' ? voucherModalDisclosure.onClose : eventModalDisclosure.onClose;
    closeFunction();
  };

  const handleUpdateVoucherQuantity = async () => {
    const quantity = Number(newQuantity);

    if (!newQuantity || quantity <= 0) {
      setError('Vui lòng nhập số lượng voucher hợp lệ.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/voucher/update?eventId=${voucherModalData.id}&quantities=${totalQuantity}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        dispatch(updateEvent({ ...voucherModalData, quantity: totalQuantity }));
        handleClose("voucher");
        setError('');
        toast({
          title: "Cập nhật thành công",
          description: "Số lượng voucher đã được cập nhật thành công.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Cập nhật thất bại",
          description: 'Có lỗi xảy ra khi cập nhật số lượng voucher.',
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      setError('An unexpected error occurred.');

    }
  };

  const handleUpdateEvent = async () => {
    const { name, startDate, endDate, isShaking, isTrivia } = eventModalData;
    if (!name || name.trim() === '') {
      toast({
        title: "Lỗi",
        description: "Tên sự kiện không được để trống.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!isShaking && !isTrivia) {
      toast({
        title: "Lỗi",
        description: "Ít nhất một trong hai game (Lắc xu hoặc Trivia) phải được chọn.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (endDate < startDate) {
      toast({
        title: "Lỗi",
        description: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const payload = {
        name,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        shaking: isShaking,
        trivia: isTrivia,
      };

      // Gọi API để cập nhật sự kiện
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/brand/event/update?eventId=${eventModalData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });


      const gameTypes = [];
      if (isShaking) gameTypes.push('Lắc xu');
      if (isTrivia) gameTypes.push('Trivia');
      const gameType = gameTypes.join(', ') || 'Unknown';

      if (response.ok) {
        const updatedEvent = {
          id: eventModalData.id,
          name,
          startDate: formatDate(payload.startDate),
          endDate: formatDate(payload.endDate),
          gameType,
        };
        dispatch(updateEvent(updatedEvent));

        eventModalDisclosure.onClose();

        toast({
          title: "Thành công",
          description: "Sự kiện đã được cập nhật thành công.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Cập nhật thất bại",
          description: "Có lỗi xảy ra khi cập nhật sự kiện.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Lỗi",
        description: "Lỗi rồi",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };


  return (
    <Box overflowX="auto" p="5" bg="white" borderRadius="xl">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text
          color={textColor}
          fontSize="2xl"
          fontWeight="bold"
          lineHeight="100%"
        >
          SỰ KIỆN
        </Text>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    colSpan={header.colSpan}
                    pe="10px"
                    borderColor={borderColor}
                    cursor="pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <Flex
                      justifyContent="space-between"
                      align="center"
                      fontSize={{ sm: '10px', lg: '12px' }}
                      color="gray.400"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {{
                        asc: '',
                        desc: '',
                      }[header.column.getIsSorted()] ?? null}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody overflowY="auto">
            {table.getRowModel().rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize).map((row) => (
              <Tr key={row.id} borderColor="transparent">
                {row.getVisibleCells().map((cell) => (
                  <Td
                    key={cell.id}
                    fontSize={{ sm: '14px' }}
                    minW={{ sm: '150px', md: '200px', lg: 'auto' }}
                    borderColor="transparent"
                    py="4"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex className='pagination' justifyContent="center" align="center">
        <Button onClick={handlePreviousPage} isDisabled={pageIndex === 0}>
          Trang trước
        </Button>
        <Text mx="4">
          Trang {pageIndex + 1}/{totalPages}
        </Text>
        <Button onClick={handleNextPage} isDisabled={pageIndex >= totalPages - 1}>
          Trang sau
        </Button>
      </Flex>

      {/* Modal */}
      {voucherModalData && (
        <Modal isOpen={voucherModalDisclosure.isOpen} onClose={() => handleClose("voucher")}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              textAlign="center"
              fontSize="lg"
              fontWeight="bold">
              THÊM SỐ LƯỢNG VOUCHER
            </ModalHeader>
            <ModalBody>
              <Text>Sự kiện: <b>{voucherModalData.name}</b></Text>
              <Text>Số lượng voucher hiện tại: <b>{voucherModalData.quantity}</b></Text>
              <Flex direction="column" mt="4">
                <FormControl isInvalid={!!error}>
                  <Input
                    type="number"
                    value={newQuantity}
                    onChange={handleQuantityChange}
                    placeholder="Nhập số lượng voucher thêm"
                  />
                  <FormErrorMessage>{error}</FormErrorMessage>
                </FormControl>
                <Text mt="2">Tổng số lượng voucher sau khi thêm: <b>{totalQuantity}</b></Text>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr="3" onClick={handleUpdateVoucherQuantity}>
                Thêm
              </Button>
              <Button onClick={() => handleClose("voucher")}>Hủy</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {eventModalData && (
        <Modal isOpen={eventModalDisclosure.isOpen} onClose={() => handleClose("event")}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center" fontSize="lg" fontWeight="bold"> CHỈNH SỬA THÔNG TIN SỰ KIỆN </ModalHeader>
            <ModalBody>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel htmlFor="eventName">
                  Tên sự kiện
                  <Text as="span" color="red.500" ml={1}>*</Text>
                </FormLabel>
                <Input
                  id="eventName"
                  type="text"
                  value={eventModalData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => validateField('name')}
                  placeholder='Tên sự kiện'
                />
              </FormControl>

              <FormControl isInvalid={!!errors.gameType}>
                <FormLabel>
                  Loại trò chơi
                  <Text as="span" color="red.500" ml={1}>*</Text>
                </FormLabel>
                <VStack align="left">
                  <Checkbox
                    isChecked={eventModalData.isShaking}
                    onChange={(e) => handleGameTypeChange('isShaking', e.target.checked)}
                  >
                    Lắc xu
                  </Checkbox>
                  <Checkbox
                    isChecked={eventModalData.isTrivia}
                    onChange={(e) => handleGameTypeChange('isTrivia', e.target.checked)}
                  >
                    Trivia (câu hỏi trắc nghiệm)
                  </Checkbox>
                </VStack>

                <FormErrorMessage>{errors.gameType}</FormErrorMessage>
              </FormControl>

              <div className='flex'>
                <FormControl isInvalid={!!errors.startDate}>
                  <FormLabel htmlFor="startDate">
                    Ngày bắt đầu
                    <Text as="span" color="red.500" ml={1}>*</Text>
                  </FormLabel>
                  <DatePicker
                    selected={eventModalData.startDate}
                    onChange={(date) => handleInputChange('startDate', date)}
                    onBlur={() => validateField('startDate')}
                    dateFormat="dd-MM-yyyy"
                    customInput={<CustomInput />}
                    minDate={new Date()}
                    className="custom-datepicker"
                  />
                  <FormErrorMessage>{errors.startDate}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.endDate}>
                  <FormLabel htmlFor="endDate">
                    Ngày kết thúc
                    <Text as="span" color="red.500" ml={1}>*</Text>
                  </FormLabel>
                  <DatePicker
                    selected={eventModalData.endDate}
                    onChange={(date) => handleInputChange('endDate', date)}
                    onBlur={() => validateField('endDate')}
                    dateFormat="dd-MM-yyyy"
                    customInput={<CustomInput />}
                    minDate={new Date()}
                    className="custom-datepicker"
                  />
                  <FormErrorMessage>{errors.endDate}</FormErrorMessage>
                </FormControl>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr="3" onClick={handleUpdateEvent}> Cập nhật </Button>
              <Button onClick={() => handleClose("event")}>Hủy</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

function determineGameType(item) {
  const types = [];
  if (item.event.trivia) {
    types.push("Trivia");
  }
  if (item.event.shaking) {
    types.push("Lắc xu");
  }
  return types.length > 0 ? types.join(", ") : "Unknown";
}

function transformData(apiData) {
  return apiData.map(item => ({
    id: item.event.id,
    name: item.event.name,
    quantity: item.voucher.voucherQuantities,
    startDate: formatDate(item.event.startDate),
    endDate: formatDate(item.event.endDate),
    participants: item.participants || 0,
    gameType: determineGameType(item)
  }));
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
}