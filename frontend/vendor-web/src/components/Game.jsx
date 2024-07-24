function Game({name, image, type, item, guild}) {
    return (
        <div className='duration-200 md:overflow-hidden rounded-lg bg-white shadow-md'>
            <div className='flex flex-col items-center'>
                <div className='relative shadow-black/5 shadow-none rounded-large'>
                    <img src={image} className='relative z-10 opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large object-cover w-[100vw] h-64 rounded-br-none rounded-bl-none' loading='lazy' alt='assets/images/tt-pc-mobile.png' width='100%' data-loaded='true' />
                </div>
                <div className='text-center pt-4 pb-2'>
                    <h1 className='text-medium sm:text-lg font-medium px-4 sm:px-0'>{name}</h1>
                </div>
            </div>
            <div className='py-3 px-4'>
                <div className='mb-1'>
                    <strong>Loại trò chơi:</strong>
                    <span> {type}</span>
                </div>
                <div className="mb-1">
                    <strong>Vật phẩm:</strong>
                    <span> {item}</span>
                </div>
                <div className="mb-1">
                    <strong>Hướng dẫn chơi:</strong>
                    <span> {guild}</span>
                </div>
            </div>
        </div>
    );
}

export default Game;
