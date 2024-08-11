import {
  Flex,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl, 
  FormErrorMessage
} from '@chakra-ui/react';
import * as React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export default function EventList(props) {
  const { tableData } = props;
  const [sorting, setSorting] = React.useState([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  const [modalData, setModalData] = React.useState(null);
  const [newQuantity, setNewQuantity] = React.useState(0);
  const [totalQuantity, setTotalQuantity] = React.useState(0);
  const [error, setError] = React.useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = 'black';
  const borderColor = 'gray.200';

  const columns = [
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
              setModalData({
                name: info.row.original.name,
                quantity: info.getValue(),
              });
              setTotalQuantity(info.getValue());
              setNewQuantity('');
              onOpen();
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
    setTotalQuantity(modalData.quantity + Number(value));
  };

  const handleClose = () => {
    setError('');
    onClose();
  }

  const handleSubmit = () => {
    const quantity = Number(newQuantity);

    if (!newQuantity || quantity <= 0) {
      setError('Vui lòng nhập số lượng voucher hợp lệ.');
      return;
    }

    setError('');

    console.log(`Added ${newQuantity} vouchers to ${modalData.name}`);
    onClose();
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
      {modalData && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              textAlign="center"
              fontSize="lg"
              fontWeight="bold">
              THÊM SỐ LƯỢNG VOUCHER
            </ModalHeader>
            <ModalBody>
              <Text>Sự kiện: <b>{modalData.name}</b></Text>
              <Text>Số lượng voucher hiện tại: <b>{modalData.quantity}</b></Text>
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
    </Box>
  );
}
