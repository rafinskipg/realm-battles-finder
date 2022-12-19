import { useEffect, useMemo, useState } from 'react';
import { getAdventurers } from '../api/getAdventurers';
import { getOponents } from '../api/getOponents';
import { AdventurerType } from '../types/adventurer';
import { Adventurer } from './Adventurer';
import abi from '../fight.abi.json';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { getProof } from '../fight';
import { BigNumber } from 'ethers';
export default function Adventurers({ address }: { address: string }) {
  const [adventurers, setAdventurers] = useState<AdventurerType[]>([]);
  const [maxDownside, setMaxDownside] = useState(20);
  const [maxUpside, setMaxUpside] = useState(0);
  const [oponents, setOponents] = useState<any>([]);
  useEffect(() => {
    const fetchADV = async () => {
      const adv = await getAdventurers(address);
      setAdventurers(adv);
    };
    fetchADV();
  }, [address]);

  const fetchOponents = async () => {
    const op = await getOponents(adventurers, maxDownside, maxUpside);

    setOponents(op);
  };

  const { config } = usePrepareContractWrite({
    args: [adventurers.map(i => i.owner), adventurers.map(i => i.tokenId), [], [], [], []]
  });

  const { data, writeAsync, error, isError, isLoading } = useContractWrite({
    address: '0x60f8C904b8CC00713f83D0Cd8ed22F1647432f62',
    abi: abi,
    functionName: 'fight',
    mode: 'recklesslyUnprepared',
    overrides: {
      gasLimit: BigNumber.from(9000000)
    }
  });

  const fight = async () => {
    if (writeAsync) {
      const ownerAddresses: string[] = [];
      const tokenIds: number[] = [];
      const proofs: string[][] = [];
      const oppAddresses: string[] = [];
      const oppIds: number[] = [];
      const oppProofs: string[][] = [];
      console.log(oponents);
      Object.keys(oponents).forEach(tokenId => {
        const op = oponents[tokenId];
        const adv = adventurers.find(i => i.tokenId === (tokenId as any));

        if (adv) {
          //  proofs.push(getProof(adv.owner))
          ownerAddresses.push('0x747910B74D2651A06563C3182838EAE4120F4277');
          tokenIds.push(parseInt(adv.tokenId as any, 10));
          oppAddresses.push('0x747910B74D2651A06563C3182838EAE4120F4277');
          oppIds.push(parseInt(op.tokenId, 10));
          //  oppProofs.push(getProof(op.owner))
        }
      });

      console.log('eee', [ownerAddresses, tokenIds, proofs, oppAddresses, oppIds, oppProofs]);

      try {
        await writeAsync({
          recklesslySetUnpreparedArgs: [ownerAddresses, tokenIds, proofs, oppAddresses, oppIds, oppProofs]
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div>
      <h2>My adventurers</h2>
      <div className="wrapper">
        {adventurers &&
          adventurers.map((adv, index) => {
            return (
              <div className="adventurer" key={`adventurer-${index}`}>
                <div>
                  <h3>Adventurer</h3>
                  <Adventurer adventurer={adv} />
                </div>
                {oponents[adv.tokenId] && (
                  <div>
                    <h3>OPONENT</h3>
                    <Adventurer adventurer={oponents[adv.tokenId]} />
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <div className="actions">
        <button onClick={fetchOponents}>Find opponents</button>
        {Object.keys(oponents).length > 0 && (
          <button onClick={fight}>{isLoading ? 'Loading...' : 'Fight!'}</button>
        )}
        {error && JSON.stringify(error, null, 2)}
        {isError && <div>Error on the transaction</div>}

        <h3>Max difference down</h3>
        <input
          type="number"
          value={maxDownside}
          onChange={e => {
            setMaxDownside(parseInt(e.target.value));
          }}
        />

        <h3>Max difference up</h3>
        <input
          type="number"
          value={maxUpside}
          onChange={e => {
            setMaxUpside(parseInt(e.target.value));
          }}
        />
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-wrap: wrap;
        }

        .adventurer {
          margin: 10px;
          display: flex;
        }
      `}</style>
    </div>
  );
}
