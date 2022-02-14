const PandaNFT = artifacts.require('PandaNFT');
const BN = web3.utils.BN;
require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BN)).should();



// For Random Number Generator
const fs = require('fs');
// Time Helpers
const { advanceBlock,
    advanceBlockTo,
    latest,
    latestBlock,
    increase,
    increaseTo,
    duration } = require('./helpers/time');

let start;
let fee;

contract('PanToken', accounts => {


    beforeEach(async () => {
        this.token = await PandaNFT.new();

        fee = await this.token.fee();
        await this.token.setPaused().should.be.fulfilled;
    });

    // name and symbol
    describe('Set functions work properly', () => {
        it('setPaused', async () => {
            let paused = await this.token.paused();
            assert.equal(paused, false);

            await this.token.setPaused().should.be.fulfilled;
            paused = await this.token.paused();
            assert.equal(paused, true);
            
            await this.token.setPaused({ from: accounts[1] }).should.be.rejectedWith('revert');
            paused = await this.token.paused();
            assert.equal(paused, true);
        });

        it('setFee', async () => {
            const newFee = Number(10**6)
            await this.token.setFee(newFee).should.be.fulfilled;
            fee = await this.token.fee();
            assert.equal(fee, newFee);

            await this.token.setFee(newFee * 10, { from: accounts[1] }).should.be.rejectedWith('revert');
        });

        it('setClassLimit', async () => {
            const newClassLimit = 5;
            await this.token.setClassLimit(newClassLimit).should.be.fulfilled;
            const classLimit = await this.token.classLimit();
            assert.equal(newClassLimit, classLimit);

            await this.token.setClassLimit(newClassLimit + 5, { from: accounts[1] }).should.be.rejectedWith('revert');
        });

        it('setEquipLimit', async () => {
            const newEquipLimit = 5;
            await this.token.setClassLimit(newEquipLimit).should.be.fulfilled;
            const equipLimit = await this.token.classLimit();
            assert.equal(newEquipLimit, equipLimit);

            await this.token.setClassLimit(newEquipLimit + 5, { from: accounts[1] }).should.be.rejectedWith('revert');
        });

        it('setRarityLimit', async () => {
            const newRarityLimit = 5;
            await this.token.setClassLimit(newRarityLimit).should.be.fulfilled;
            const RarityLimit = await this.token.classLimit();
            assert.equal(newRarityLimit, RarityLimit);

            await this.token.setClassLimit(newRarityLimit + 5, { from: accounts[1] }).should.be.rejectedWith('revert');
        });

        it('setRarities', async () => {
            var [a, b, c, d, e] = [1, 2, 3, 4, 5]
            await this.token.setRarities(a, b, c, d, e).should.be.fulfilled;
            const rarities = await this.token.rarities();
            assert.equal(a, Number(rarities[0]));
            assert.equal(b, Number(rarities[1]));
            assert.equal(c, Number(rarities[2]));
            assert.equal(d, Number(rarities[3]));
            assert.equal(e, Number(rarities[4]));

            await this.token.setRarities(2,3,4,5,6, { from: accounts[1] }).should.be.rejectedWith('revert');
        });
    });


    // describe('Randomness function', () => {
    //     it('Returns a random number', async () => {
            // let result;
            // let counter = 0;
            // let dupecounter = 0;
            // let Aarray = [];
            // let Barray = [];
            // let Carray = [];
            // let Darray = [];
            // let Allarray = [];

            // while (counter < 5000) {
            //     result = Number(await this.token.getRandomNumber(100))
            //     counter++;
            //     // counter % 1000 == 0 ? console.log(counter) : "";
            //     result = await this.token.getRandomNumber(100, { from:accounts[counter] });
                
            //     // if all number equal each other console log which ones
            //     if (Number(result[0]) == Number(result[1]) || Number(result[0]) == Number(result[2]) ||
            //          Number(result[0]) == Number(result[3]) || Number(result[1]) == Number(result[2]) ||
            //           Number(result[1]) == Number(result[3]) || Number(result[2]) == Number(result[3])){
            //         // console.log(Number(result[0]), Number(result[1]), Number(result[2]), Number(result[3]));
            //         dupecounter++
            //         console.log(dupecounter, "/", counter);
            //     }

            //     Aarray.push(Number(result[0]));
            //     Barray.push(Number(result[1]));
            //     Carray.push(Number(result[2]));
            //     Darray.push(Number(result[3]));
            //     Allarray.push(Number(result[0]), Number(result[1]), Number(result[2]), Number(result[3]));

            //     start = await latest();
            //     end = start.add(duration.seconds(1));
            //     await increaseTo(end);
            // }
            // fs.writeFile('Aresults.txt', Aarray.toString(), (err) => {err ? console.log(err): "10"});
            // fs.writeFile('Bresults.txt', Barray.toString(), (err) => {err ? console.log(err): "10"});
            // fs.writeFile('Cresults.txt', Carray.toString(), (err) => {err ? console.log(err): "10"});
            // fs.writeFile('Dresults.txt', Darray.toString(), (err) => {err ? console.log(err): "10"});
            // fs.writeFile('Allresults.txt', Allarray.toString(), (err) => {err ? console.log(err): "10"});
        // });
    // });

    describe('Minting', () => {
        it('can create a panda', async () => {
            await this.token.setPaused().should.be.fulfilled;
            await this.token.mintPanda({ value: fee }).should.be.rejectedWith('revert');
            await this.token.setPaused().should.be.fulfilled;

            await this.token.mintPanda({ value: fee }).should.be.fulfilled;
            await this.token.mintPanda().should.be.rejectedWith('revert');

            let pandas = await this.token.getPandas();
            let owner = await this.token.balanceOf(accounts[0], pandas[0].id);
            assert.equal(owner, 1)

            start = await latest();
            end = start.add(duration.seconds(1));
            await increaseTo(end);

            await this.token.mintPanda({ from: accounts[1], value: fee }).should.be.fulfilled;
            await this.token.mintPanda({ from: accounts[1] }).should.be.rejectedWith('revert');

            pandas = await this.token.getPandas();
            owner = await this.token.balanceOf(accounts[1], pandas[1].id);
            assert.equal(owner, 1);
        });
    });

    describe('Transferring', () => {
        it('can send between two people', async () => {
            await this.token.mintPanda({from: accounts[2], value: fee }).should.be.fulfilled;
            let pandasOwned = await this.token.balanceOf(accounts[2], 0);
            assert.equal(1, pandasOwned);

            await this.token.safeTransferFrom(accounts[2], accounts[1], 0, 1, 99, { from: accounts[2] });
            pandasOwned = await this.token.balanceOf(accounts[2], 0);
            assert.equal(0, pandasOwned);

            pandasOwned = await this.token.balanceOf(accounts[1], 0);
            assert.equal(1, pandasOwned);
        });

        it('can send between three people', async () => {
            await this.token.mintPanda({ from: accounts[1], value: fee }).should.be.fulfilled;
            let pandasOwned = await this.token.balanceOf(accounts[1], 0);
            assert.equal(1, pandasOwned);

            await this.token.safeTransferFrom(accounts[1], accounts[2], 0, 1, 99, { from: accounts[1] });
            pandasOwned = await this.token.balanceOf(accounts[2], 0);
            assert.equal(1, pandasOwned);

            await this.token.safeTransferFrom(accounts[2], accounts[3], 0, 1, 99, { from: accounts[2] });
            pandasOwned = await this.token.balanceOf(accounts[1], 0);
            assert.equal(0, pandasOwned);

            pandasOwned = await this.token.balanceOf(accounts[2], 0);
            assert.equal(0, pandasOwned);
            pandasOwned = await this.token.balanceOf(accounts[3], 0);
            assert.equal(1, pandasOwned);
        });
    });

    describe('Approvals', () => {
        it('can approve others', async () => {
            await this.token.mintPanda({ value: fee });
            let pandasOwned = await this.token.balanceOf(accounts[0], 0);

            await this.token.setApprovalForAll(accounts[1], true);
            let approved = await this.token.isApprovedForAll(accounts[0], accounts[1]);
            assert.equal(approved, true);

            await this.token.safeTransferFrom(accounts[0], accounts[2], 0, 1, 99, { from: accounts[1] });
            let balance = await this.token.balanceOf(accounts[0], 0);
            assert.equal(balance, 0);
        });
    });



    describe('Withdraw', () => {
        it('should let only the owner withdraw funds', async () => {
            const deployerBalance1 = await web3.eth.getBalance(accounts[0]);
            let contractBalance = await web3.eth.getBalance(this.token.address);
            assert.equal(Number(contractBalance), 0);

            await this.token.mintPanda({ value: fee, from: accounts[1] });
            contractBalance = await web3.eth.getBalance(this.token.address);
            assert.equal(contractBalance, fee);

            await this.token.withdraw();
            await this.token.withdraw({ from:accounts[1] }).should.be.rejectedWith('revert');
            const deployerBalance2 = await web3.eth.getBalance(accounts[0]);
            assert.equal(Number(deployerBalance2) > Number(deployerBalance1), true);
        });
    });

    describe('setLocked', () => {
        it('Should set locked to true and back', async () => {
            await this.token.mintPanda({ value: fee }).should.be.fulfilled;
            await this.token.setLocked(0).should.be.fulfilled;
            await this.token.setLocked(0, { from: accounts[1] }).should.be.rejectedWith('revert');
    
            let pandas = await this.token.getPandas();
            let lockedStatus = pandas[0].locked;
            assert.equal(lockedStatus, true);
        });
    });

    describe('Sacrifice', () => {
        it('should allow sacrifices', async () => {
            await this.token.mintPanda({ value: fee }).should.be.fulfilled;
            await this.token.mintPanda({ from: accounts[1], value: fee }).should.be.fulfilled;
            let pandas = await this.token.getPandas();

            await this.token.sacrifice(1, 0, { from: accounts[1] }).should.be.rejectedWith('revert');
            await this.token.sacrifice(1, 0).should.be.fulfilled;
            pandas = await this.token.getPandas();
            assert.equal(pandas[1].id, 1);

            let balances = Number(await this.token.balanceOf(accounts[0], 0));
            assert.equal(balances, 0);
        });

        it('should not allow sacrifices past max classes', async () => {

            for (let i = 0; i < 16; i++){
                await this.token.mintPanda({ value: fee });
            }

            // Sacrifice Every 2nd Panda for Class 1
            for (let i = 0; i < 16; i+=2) {
                await this.token.sacrifice(i, i+1).should.be.fulfilled;
            }
            
            // Sacrifice Every 3 Panda for Class 2
            for (let i = 0; i < 16; i+=4) {
                await this.token.sacrifice(i, i+2).should.be.fulfilled;
            }

            // Sacrifice Every 4th Panda for Class 3
            for (let i = 0; i < 16; i+=8) {
                await this.token.sacrifice(i, i+4);
            }

            // Class 4
            await this.token.sacrifice(0, 8).should.be.rejectedWith('revert');
        });
    });

    describe('getRarity', () => {
        it('Return the right rarity', async () => {
            let rarity = Number(await this.token.getRarity(80));
            assert.equal(rarity, 0);
            rarity = Number(await this.token.getRarity(90));
            assert.equal(rarity, 1);
            rarity = Number(await this.token.getRarity(95));
            assert.equal(rarity, 2);
            rarity = Number(await this.token.getRarity(99));
            assert.equal(rarity, 3);
            rarity = Number(await this.token.getRarity(100));
            assert.equal(rarity, 4);
        });
    });

});