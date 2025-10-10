export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export const CONTRACT_ABI = [
  'function invest(uint256 artworkId, bytes calldata encryptedAmount, bytes calldata inputProof) external payable',
  'function getInvestment(uint256 artworkId, address investor) external view returns (bytes32)',
  'function getTotalInvestment(uint256 artworkId) external view returns (bytes32)',
  'function listArtwork(uint256 artworkId, string memory title, string memory artist, uint256 value) external',
  'function distributeReturns(uint256 artworkId) external payable',
  'event ArtworkListed(uint256 indexed artworkId, string title, string artist, uint256 value)',
  'event InvestmentMade(uint256 indexed artworkId, address indexed investor, bytes32 encryptedAmount)',
  'event ReturnsDistributed(uint256 indexed artworkId, uint256 totalReturns)',
];
