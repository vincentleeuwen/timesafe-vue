// globals loaded by truffle test framework
/* global artifacts:true */
/* global contract:true */
/* global it:true */
/* global assert:true */
const TimeSafe = artifacts.require('./TimeSafe.sol')

/**
 * Note these are ran in order and currently re-use the deployed contract
 */
contract('TimeSafe', accounts => {
  const oneEther = 1000000000000000000

  // TimeSafe is deployed with this date - see migrations
  const FirstJan2100 = 4102444800

  it('should expose locked until timestamp', () => {
    return TimeSafe.deployed()
      .then(instance => {
        return instance.lockedUntil.call()
      })
      .then(result => assert.equal(result.valueOf(), FirstJan2100))
  })

  it('should be locked initially', () => {
    return TimeSafe.deployed()
      .then(instance => {
        return instance.locked.call()
      })
      .then(result => assert.equal(result.valueOf(), true))
  })

  it('should have no deposits initially', () => {
    return TimeSafe.deployed()
      .then(instance => {
        return instance.depositsCount.call()
      })
      .then(result => assert.equal(result.valueOf(), 0))
  })

  it('should have no withdrawals initially', () => {
    return TimeSafe.deployed()
      .then(instance => {
        return instance.withdrawalsCount.call()
      })
      .then(result => assert.equal(result.valueOf(), 0))
  })

  it('should have deposit total of zero initially', () => {
    return TimeSafe.deployed()
      .then(instance => {
        return instance.totalDeposits.call()
      })
      .then(result => assert.equal(result.valueOf(), 0))
  })

  it('should have no balance if not deposits for account', () => {
    return TimeSafe.deployed()
      .then(instance => {
        return instance.balances.call(accounts[0])
      })
      .then(result => assert.equal(result.valueOf(), 0))
  })

  it('should allow deposits from account 0 when locked', () => {
    let timeSafeInstance
    return TimeSafe.deployed()
      .then(instance => {
        timeSafeInstance = instance
        return timeSafeInstance.deposit({from: accounts[0], value: oneEther})
      })
      .then(tx => timeSafeInstance.depositsCount.call())
      .then(result => assert.equal(result.valueOf(), 1, 'made 1 deposit'))
      .then(() => timeSafeInstance.totalDeposits.call())
      .then(result => assert.equal(result.valueOf(), oneEther, 'should be exactly 1 ether in the contract'))
      .catch(ex => console.log(ex))
  })

  it('should sum mulitple deposits together from account 0 when locked', () => {
    let timeSafeInstance
    return TimeSafe.deployed()
      .then(instance => {
        timeSafeInstance = instance
        return timeSafeInstance.deposit({from: accounts[0], value: oneEther})
      })
      .then(tx => timeSafeInstance.depositsCount.call())
      .then(result => assert.equal(result.valueOf(), 2, 'made 2 deposits'))
      .then(() => timeSafeInstance.totalDeposits.call())
      .then(result => assert.equal(result.valueOf(), oneEther * 2, 'should be exactly 2 ether in the contract'))
      .catch(ex => console.log(ex))
  })
})
