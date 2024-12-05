// const calculateEloXP = (playerXP, opponentXP, playerResult, kFactor = 32) => {
//     // Calculate expected score based on current XP ratings
//     const expectedPlayer = 1 / (1 + Math.pow(10, (opponentXP - playerXP) / 400));
//     const expectedOpponent = 1 - expectedPlayer;
  
//     // Determine actual score based on result (1 if win, 0 if loss)
//     const actualScore = playerResult === 'win' ? 1 : 0;
  
//     // Calculate raw XP change
//     const xpChange = kFactor * (actualScore - expectedPlayer);
  
//     // Round XP change to nearest integer to avoid decimals
//     const roundedXPChange = Math.round(xpChange);
//     // console.log(roundedXPChange)
  
//     // Calculate new XP for player
//     const newXP = Math.max(playerXP + roundedXPChange, 0); // Ensure XP does not fall below 0
  
//     return {newXP, xpChange: roundedXPChange};
//   };


const calculateEloXP = (
  playerXP, // Current XP of the player
  playerRank, // Rank of the player
  opponentRank, // Rank of the opponent
  totalPlayers, // Total number of players
  playerResult, // 'win' or 'loss'
  kFactor = 32, // Maximum potential XP change
  minXPAdjustment = 6, // Minimum XP adjustment
  maxXPAdjustment = 32 // Maximum XP adjustment
) => {
  // console.log(playerXP, playerRank, opponentRank, totalPlayers, playerResult, kFactor, minXPAdjustment, maxXPAdjustment)
  // Calculate percentiles based on ranks
  const playerPercentile = 1 - (playerRank - 1) / totalPlayers;
  const opponentPercentile = 1 - (opponentRank - 1) / totalPlayers;
  // console.log('both percentiles........', playerPercentile, opponentPercentile)

  // Calculate expected scores based on percentiles
  const expectedPlayer = 1 / (1 + Math.pow(10, (opponentPercentile - playerPercentile)));
  const expectedOpponent = 1 - expectedPlayer;
  // console.log("plyaer expected score............", expectedPlayer)

  // Determine actual score based on result (1 for win, 0 for loss)
  const actualScore = playerResult === 'win' ? 1 : 0;
  // console.log('actual result............', actualScore)

  // Calculate raw XP change
  let xpChange = kFactor * (actualScore - expectedPlayer);

  // Round XP change to the nearest integer
  xpChange = Math.round(xpChange);

  // Ensure XP change meets the minimum adjustment
  if (Math.abs(xpChange) < minXPAdjustment) {
    xpChange = xpChange > 0 ? minXPAdjustment : -minXPAdjustment;
  }

  // Ensure XP change does not exceed the maximum adjustment
  if (Math.abs(xpChange) > maxXPAdjustment) {
    xpChange = xpChange > 0 ? maxXPAdjustment : -maxXPAdjustment;
  }
  // console.log("xpcharge...........", xpChange)

  // Calculate new XP for the player (ensuring XP does not drop below 0)
  const newXP = Math.max(playerXP + xpChange, 0);
  // console.log("new xp...........", newXP)

  // Return both the new XP and the XP change
  return { newXP, xpChange };
};
  
  export default calculateEloXP;
  