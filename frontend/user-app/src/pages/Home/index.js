function Home() {
    return (
        <div className="flex-col">
            <a href="/game">
                <div className="card bg-base-100 w-96 shadow-xl my-5 mx-10">
                    <figure>
                        <img
                            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                            alt="Shoes" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            New event
                            <div className="badge badge-secondary">NEW</div>
                        </h2>
                        <p>Click here to join game</p>
                        <div className="card-actions justify-end">
                            <div className="badge badge-outline">Shaker</div>
                            <div className="badge badge-outline">Vouchers</div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    );
}

export default Home;
