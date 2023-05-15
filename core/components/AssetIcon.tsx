import React, { FC } from 'react'

interface AssetIconProps {
  assetId: number
  assetIcons: string[]
}

const AssetIcon: FC<AssetIconProps> = ({ assetId, assetIcons }) => {
  const getLogoSrc = (id: number): string => {
    if (assetIcons?.includes(id?.toString()))
      return `https://asa-list.tinyman.org/assets/${id}/icon.png`
    return '/assets/placeholder.png'
  }

  return (
    <img
      className="absolute h-full w-full rounded"
      src={getLogoSrc(assetId)}
      alt={`asset-${assetId}`}
    />
  )
}

export default AssetIcon
