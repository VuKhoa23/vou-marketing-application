function Event({ id, name, brand, image, voucher, startDate, endDate, gameType }) {

    function parseDate(dateString) {
        const [day, month, year] = dateString.split('-');
        return new Date(year, month - 1, day);
    }

    const now = new Date();

    // Xác định trạng thái của sự kiện
    let statusBadge;
    if (now < parseDate(startDate)) {
        statusBadge = <div className="badge badge-outline border-blue-500 text-blue-500">Sắp bắt đầu</div>;
    } else if (now > parseDate(endDate)) {
        statusBadge = <div className="badge badge-outline border-gray-500 text-gray-500">Đã kết thúc</div>;
    } else {
        statusBadge = <div className="badge badge-outline border-red-500 text-red-500">Đang diễn ra</div>;
    }
    return (
        <div className="card bg-base-100 w-96 shadow-xl">
            <figure className="w-full h-48 overflow-hidden">
                <img
                    src={image}
                    //alt={name}
                    className="w-full h-full object-cover" />
            </figure>
            <div className="card-body">
                <h2 className="card-title line-clamp-1">
                    {name}
                </h2>
                <p>Thương hiệu: {brand}</p>
                <p>Số lượng voucher: {voucher}</p>
                <p>Loại sự kiện: {gameType === 'Lắc xu' ? "Game lắc xu" : "Game Trivia"}</p>
                <p>Thời gian: {startDate} đến {endDate}</p>
                <div className="card-actions flex items-center justify-end space-x-2">
                    {statusBadge}
                </div>
            </div>
        </div>
    );
}

export default Event;


