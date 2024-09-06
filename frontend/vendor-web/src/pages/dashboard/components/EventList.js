import {
  Flex, Box, Table, Tbody, Td, Text, Th, Thead, Tr, Button, Input,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
  FormControl, FormErrorMessage, FormLabel, InputGroup, InputRightElement, Icon,
  VStack, Checkbox
} from '@chakra-ui/react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { CalendarIcon } from '@chakra-ui/icons';
import DatePicker from 'react-datepicker';
import * as React from 'react';


const columnHelper = createColumnHelper();

export default function EventList(props) {
  const { tableData } = props;
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
    name: '',
    startDate: '',
    endDate: '',
    isShaking: false,
    isTrivia: false,
  });


  const textColor = 'black';
  const borderColor = 'gray.200';

  const [errors, setErrors] = React.useState({
    eventName: '',
    startDate: '',
    endDate: '',
    gameType: '',
  });

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
      case 'eventName':
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
          STT
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
    columnHelper.accessor('participants', {
      id: 'participants',
      header: () => (
        <Text
          justifyContent="space-between"
          align="center"
          fontSize={{ sm: '10px', lg: '12px' }}
          color="gray.400"
        >
          SỐ LƯỢNG NGƯỜI THAM GIA
        </Text>
      ),
      cell: (info) => (
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {info.getValue()}
        </Text>
      ),
    }),
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
              name: info.row.original.name,
              startDate: info.row.original.startDate,
              endDate: info.row.original.endDate,
            }));
            eventModalDisclosure.onOpen();
            console.log(eventModalData);
          }}
        >
          Chỉnh sửa
        </Button>
      ),
    }),
  ];


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
    const closeFunction = modalType === 'voucher' ? voucherModalDisclosure.onClose : eventModalDisclosure.onClose;
    closeFunction();
  };

  const handleSubmit = () => {
    const quantity = Number(newQuantity);
    if (!newQuantity || quantity <= 0) {
      setError('Vui lòng nhập số lượng voucher hợp lệ.');
      return;
    }
    setError('');
    console.log(`Added ${newQuantity} vouchers to ${voucherModalData.name}`);
    handleClose("voucher");
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
              <Button colorScheme="blue" mr="3" onClick={handleSubmit}>
                Thêm
              </Button>
              <Button onClick={handleClose}>Hủy</Button>
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
              <FormControl>
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
                    selected={new Date(eventModalData.startDate.split("-").reverse().join("-"))}
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
                    selected={new Date(eventModalData.endDate.split("-").reverse().join("-"))}
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
              <Button colorScheme="blue" mr="3" onClick={handleSubmit}> Cập nhật </Button>
              <Button onClick={handleClose}>Hủy</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
