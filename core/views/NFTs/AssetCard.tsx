import React, { useMemo } from 'react';
import { AssetParams } from '../../utils/account';
import Amount from '../../components/Amount';
import IconButton from '../../components/IconButton';
import { FaPaperPlane, FaTrash } from 'react-icons/fa';
import assetPlaceholder from '../../assets/asset.png';
import Card from '../../components/Card';
import { classNames } from '../../utils/common';
import { Link, useNavigate } from 'react-router-dom';
import { Network } from '../../utils/network';
import { useStore } from '../../utils/store';
import { decodeAddress } from 'algosdk'
import { sha256 } from 'js-sha256'
import { CID } from 'multiformats/cid'
import * as mfsha2 from 'multiformats/hashes/sha2'
import * as digest from 'multiformats/hashes/digest'
import { CIDVersion } from 'multiformats/types/src/cid'


export const ARC3_NAME_SUFFIX = "@arc3"
export const ARC3_URL_SUFFIX = "#arc3"
export const ARC19_NAME_SUFFIX = "@arc3"
export const ARC19_URL_SUFFIX = "#arc3"
export const ARC69_NAME_SUFFIX = "@arc69"
export const ARC69_URL_SUFFIX = "#arc69"
export const METADATA_FILE = "metadata.json"
export const JSON_TYPE = "application/json"

interface AssetCardProps {
  id: number;
  amount: number;
  assets: Record<number, AssetParams>;
}

const AssetCard: React.FC<AssetCardProps> = ({ id, amount, assets }) => {
  const { state } = useStore();
  const navigate = useNavigate();

  //console.log("assets", assets)
 function resolveProtocol(url: string, reserveAddr: string): string {
    if (url.endsWith(ARC3_URL_SUFFIX))
      url = url.slice(0, url.length - ARC3_URL_SUFFIX.length)
    if (url.endsWith(ARC69_URL_SUFFIX))
      url = url.slice(0, url.length - ARC69_URL_SUFFIX.length)
    const chunks = url.split("://")
    // Check if prefix is template-ipfs and if {ipfscid:..} is where CID would normally be
    if (chunks[0] === 'template-https' && chunks[1].includes('{ipfscid:')) {
        // Look for something like: template:ipfs://{ipfscid:1:raw:reserve:sha2-256} and parse into components
        chunks[0] = 'ipfs'
        const cidComponents = chunks[1].split(':')
        if (cidComponents.length !== 5) {
            // give up
            //console.log('unknown ipfscid format')
            return url
        }
        const [, cidVersion, cidCodec, asaField, cidHash] = cidComponents

        // const cidVersionInt = parseInt(cidVersion) as CIDVersion
        if (cidHash.split('}')[0] !== 'sha2-256') {
            //console.log('unsupported hash:', cidHash)
            return url
        }
        if (cidCodec !== 'raw' && cidCodec !== 'dag-pb') {
            //console.log('unsupported codec:', cidCodec)
            return url
        }
        if (asaField !== 'reserve') {
            //console.log('unsupported asa field:', asaField)
            return url
        }
        let cidCodecCode
        if (cidCodec === 'raw') {
            cidCodecCode = 0x55
        } else if (cidCodec === 'dag-pb') {
            cidCodecCode = 0x70
        }

        // get 32 bytes Uint8Array reserve address - treating it as 32-byte sha2-256 hash
        //console.log("reserveAddr", reserveAddr)
        const addr = decodeAddress(reserveAddr)
        const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey)

        const cid = CID.create(parseInt(cidVersion) as CIDVersion, cidCodecCode as any, mhdigest)
        //console.log('switching to id:', cid.toString())
        chunks[1] = cid.toString()
        //console.log('redirecting to ipfs:', chunks[1])
    }
    if (chunks[0] === 'template-ipfs' && chunks[1].startsWith('{ipfscid:')) {
        // Look for something like: template:ipfs://{ipfscid:1:raw:reserve:sha2-256} and parse into components
        chunks[0] = 'ipfs'
        const cidComponents = chunks[1].split(':')
        if (cidComponents.length !== 5) {
            // give up
            console.log('unknown ipfscid format')
            return url
        }
        const [, cidVersion, cidCodec, asaField, cidHash] = cidComponents

        // const cidVersionInt = parseInt(cidVersion) as CIDVersion
        if (cidHash.split('}')[0] !== 'sha2-256') {
            console.log('unsupported hash:', cidHash)
            return url
        }
        if (cidCodec !== 'raw' && cidCodec !== 'dag-pb') {
            console.log('unsupported codec:', cidCodec)
            return url
        }
        if (asaField !== 'reserve') {
            console.log('unsupported asa field:', asaField)
            return url
        }
        let cidCodecCode
        if (cidCodec === 'raw') {
            cidCodecCode = 0x55
        } else if (cidCodec === 'dag-pb') {
            cidCodecCode = 0x70
        }

        // get 32 bytes Uint8Array reserve address - treating it as 32-byte sha2-256 hash
        const addr = decodeAddress(reserveAddr)
        const mhdigest = digest.create(mfsha2.sha256.code, addr.publicKey)
        const cid = CID.create(parseInt(cidVersion) as CIDVersion, cidCodecCode as any, mhdigest)
        chunks[1] = cid.toString() + '/' + chunks[1].split('/').slice(1).join('/')
    }
  // No protocol specified, give up
  if (chunks.length < 2) return url

  // Switch on the protocol
  switch (chunks[0]) {
    case "ipfs": // Its ipfs, use the configured gateway
      return 'https://ipfs.algonode.xyz/ipfs/' + chunks[1] + '?optimizer=image&width=56&quality=70'
    case "https": // Its already http, just return it
      return (chunks[1].includes("ipfs.algonode.xyz/ipfs"))? url.replace("#i", "") + '?optimizer=image&width=56&quality=70' : url
    default:
      return url
  }
}

  const [name, ticker, decimals, url, reserve] = useMemo(() => {
      const asset: AssetParams | undefined = assets[id];
      let name = '';
      let ticker = '';
      let url = '';
      let reserve = '';
      try {
        name = window.atob(asset?.['name-b64']);
        ticker = window.atob(asset?.['unit-name-b64']);
        url = window.atob(asset?.['url']);
        reserve = window.atob(asset?.['reserve']);
      } catch {
        // pass
      }
      return [
        asset?.name || name,
        asset?.['unit-name'] || ticker,
        asset?.decimals || 0,
        asset?.['url'] || url,
        asset?.['reserve'] || reserve,
      ];
  }, [id, assets]);
 
  return (
    <Card
      onClick={
        state.display === 'extension' ? () => navigate(`send/${id}`) : undefined
      }
      className={classNames(
        'w-full items-center flex justify-between',
        amount === 0 && 'opacity-50 hover:opacity-100'
      )}
    >
      <div className="flex items-center space-x-2">
        <div className="min-w-max px-2">
          <img src={(resolveProtocol(url, reserve) !=='')? resolveProtocol(url, reserve) : assetPlaceholder} className="w-14 h-14" alt="asset" />
        </div>
        <div>
          <div className="text-base font-bold">{name || 'Unknown'}</div>
          <div className="space-x-2 opacity-80 font-mono">
            {ticker && <span>{ticker}</span>}
            <span className="text-xs opacity-70">{id}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 divide-x divide-opacity-50 dark:divide-gray-600">
        <div className="flex items-end space-x-2 px-2">
          <Amount amount={amount} decimals={decimals} size={1.25} />
          {ticker && <span className="font-mono opacity-80">{ticker}</span>}
        </div>
        <div
          className={classNames(
            'px-4 flex space-x-2 items-center',
            state.display === 'extension' && 'hidden'
          )}
        >
          {amount > 0 && (
            <Link to={`/send/${id}`}>
              <IconButton IconComponent={FaPaperPlane} small name="Send" />
            </Link>
          )}
            <IconButton IconComponent={FaTrash} small name="Opt out" />
        </div>
      </div>
    </Card>
  );
};

export default AssetCard;
