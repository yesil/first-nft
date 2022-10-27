import { useCallback, useEffect, useState } from "react";
import { ethers, providers } from "ethers";
import reactLogo from "./assets/react.svg";
import "./App.css";

const abi = ["function safeMint(string memory uri) public"];

function App() {
  const [assets, setAssets] = useState([]);
  const [nftContract, setNftContract] = useState<ethers.Contract>();

  useEffect(() => {
    fetch("//localhost:3000/assets")
      .then((res) => res.json())
      .then(setAssets);
  }, []);

  useEffect(() => {
    const provider = new providers.Web3Provider((window as any).ethereum);
    provider.send("eth_requestAccounts", []).then(() => {
      const nftContract = new ethers.Contract(
        "0x1ad9Cb7e96efab688A983c8d7d0392921EBc59e1",
        abi,
        provider.getSigner()
      );
      setNftContract(nftContract);
    });
  }, []);

  const mint = (metadataCid: string) => {
    if (nftContract) {
      nftContract.safeMint(metadataCid);
    }
  };

  const assetsList = assets.map(
    ({ metadataCid, metadata: { attributes, name, image } }) => {
      return (
        <div className="nft" key={metadataCid}>
          <h2>{name}</h2>
          <img src={image}></img>
          <ul>
            {(attributes as any[]).map(({ trait_type, value }) => (
              <li key={trait_type}>
                <strong>{trait_type}</strong>:{value}
              </li>
            ))}
          </ul>
          <button onClick={() => mint(metadataCid)}>Mint</button>
        </div>
      );
    }
  );

  return (
    <div className="App">
      <h1>First NFT</h1>
      <div className="nft-list">{assetsList}</div>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
    </div>
  );
}

export default App;
