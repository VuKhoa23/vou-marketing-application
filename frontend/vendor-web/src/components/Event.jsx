import { NavLink } from "react-router-dom";


function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day); // JavaScript dùng tháng từ 0 (0 = January)
}


function Event({ id, name, brand, image, voucher, begin, end }) {

        // Chuyển đổi chuỗi thời gian thành đối tượng Date
        const beginDate = new parseDate(begin);
        const endDate = new parseDate(end);
        const now = new Date();
    
        // Xác định trạng thái của sự kiện
        let statusBadge;
        if (now < beginDate) {
            statusBadge = <div className="badge badge-outline border-blue-500 text-blue-500">Sắp bắt đầu</div>;
        } else if (now > endDate) {
            statusBadge = <div className="badge badge-outline border-gray-500 text-gray-500">Đã kết thúc</div>;
        } else {
            statusBadge = <div className="badge badge-outline border-red-500 text-red-500">Đang diễn ra</div>;
        }

    return (
        <NavLink to={id} className="card bg-base-100 w-96 shadow-xl">
            <figure className="w-full h-48 overflow-hidden">
                <img
                    src={image}
                    alt="Dookki"
                    className="w-full h-full object-cover" />
            </figure>
            <div className="card-body">
                <h2 className="card-title line-clamp-1">
                    {name}
                </h2>
                <p>Thương hiệu: {brand}</p>
                <p>Số lượng voucher: {voucher}</p>
                <p>Thời gian: {begin} đến {end}</p>
                <div className="card-actions flex items-center justify-end space-x-2">
                    {statusBadge}
                </div>
            </div>
        </NavLink>
    );
}


export default Event;