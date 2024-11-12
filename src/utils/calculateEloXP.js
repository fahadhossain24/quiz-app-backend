const calculateEloXP = (playerXP, opponentXP, playerResult, kFactor = 32) => {
    // Calculate expected score based on current XP ratings
    const expectedPlayer = 1 / (1 + Math.pow(10, (opponentXP - playerXP) / 400));
    const expectedOpponent = 1 - expectedPlayer;
  
    // Determine actual score based on result (1 if win, 0 if loss)
    const actualScore = playerResult === 'win' ? 1 : 0;
  
    // Calculate raw XP change
    const xpChange = kFactor * (actualScore - expectedPlayer);
  
    // Round XP change to nearest integer to avoid decimals
    const roundedXPChange = Math.round(xpChange);
  
    // Calculate new XP for player
    const newXP = Math.max(playerXP + roundedXPChange, 0); // Ensure XP does not fall below 0
  
    return newXP;
  };
  
  export default calculateEloXP;
  