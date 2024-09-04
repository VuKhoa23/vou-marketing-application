function Home() {
    return (
        <div className="flex-col">
            <a href="/game">
                <div className="card bg-base-100 w-96 shadow-xl mx-10">
                    <figure>
                        <img
                            src="https://vcdn1-kinhdoanh.vnecdn.net/2020/12/12/Grab-settop-01_1607740624.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=CsnyXdfpv8CUAIYVUWpB6g"
                            alt="Shoes" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            Sự kiện của Grab
                            <div className="badge badge-secondary">NEW</div>
                        </h2>
                        <p>Tham gia ngay!</p>
                        <div className="card-actions justify-end">
                            <div className="badge badge-outline">Trivia</div>
                            <div className="badge badge-outline">Grab Voucher</div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default Home;
