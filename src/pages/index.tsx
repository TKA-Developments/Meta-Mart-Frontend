import Image from "next/image";

const Index = () => {
  return (
    <>
      <div className="flex items-center">
        <div className="flex flex-row w-full mx-20 flex-wrap">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mt-12">
              Discover, collect, and sell extraordinary NFTs
            </h2>
            <h3 className="mt-6 text-xl">
              Meta Mart is the world's first and largest NFT marketplace
            </h3>
          </div>
          <div className="flex-1">
            {/* <Image
              src="/assets/img/stock1.jpg"
              layout="fill"
              objectFit="contain"
              width={400}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
