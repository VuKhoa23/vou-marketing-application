import { DUMMY_EVENTS } from '../dummy-events.js';
import Event from '../components/Event';


function EventsPage() {
    return (
        <>
            <div className='flex flex-col md:flex-row justify-center items-center m-10'>
                <h1 className='text-3xl font-bold flex-1 mt-10 md:mt-0'>Tất cả sự kiện</h1>
                <label className="order-first md:order-none border-b border-gray-300 flex items-center gap-2 pb-1 w-full md:w-auto">
                    <input type="text" className="grow" placeholder="Tìm kiếm sự kiện..." />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                    </svg>
                </label>
            </div>

            <ul className='flex flex-wrap justify-center space-x-4 md:space-x-6 lg:space-x-8 mb-10'>
                {DUMMY_EVENTS.map((event) => (
                    <li key={event.id} className='m-4 hover:shadow-lg'>
                        <Event {...event} />
                    </li>
                ))}
            </ul>
            <div className="hero bg-base-200 p-20">
                <div className="hero-content flex-col lg:flex-row">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                        alt='abc'
                        className="max-w-sm rounded-lg shadow-2xl" />
                    <div>
                        <h1 className="text-5xl font-bold">Đăng ký sự kiện!</h1>
                        <p className="py-6">
                            Chúng tôi cung cấp dịch vụ tạo sự kiện trò chơi sáng tạo giúp bạn thu hút sự chú ý và kết nối sâu sắc với khách hàng. Đừng bỏ lỡ cơ hội để làm nổi bật thương hiệu và sản phẩm của bạn thông qua các trải nghiệm tương tác đầy ấn tượng. Hãy hợp tác với chúng tôi và biến mỗi sự kiện thành một chiến lược quảng cáo hiệu quả!
                        </p>
                        <button className="btn btn-primary">Đăng ký ngay</button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default EventsPage;