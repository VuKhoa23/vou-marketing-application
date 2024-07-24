import dookki from './assets/Events/dookki.jpg';
import highlands from './assets/Events/Highlands.jpg';
import threeoclock from './assets/Events/3oclock.jpg';

export const DUMMY_EVENTS = [
    {
        id: '01',
        name: 'Dookki khai trương chi nhánh mới tại thành phố Hồ Chí Minh',
        brand: 'Dookki',
        image: dookki,
        voucher: 100,
        begin: '01/08/2024',
        end: '31/08/2024',
    },
    {
        id: '02',
        name: 'Sinh nhật 5 tuổi Highlands Coffee Việt Nam',
        brand: 'Highlands Coffee',
        image: highlands,
        voucher: 100,
        begin: '01/07/2024',
        end: '31/07/2024',
    },
    {
        id: '03',
        name: 'Lễ tình nhân 2024',
        brand: 'Three OClock',
        image: threeoclock,
        voucher: 500,
        begin: '01/02/2024',
        end: '01/03/2024',
    },
];