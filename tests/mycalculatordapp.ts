const assert = require('assert')
const anchor = require('@project-serum/anchor')
const {SystemProgram} = anchor.web3

describe('mycalculatordapp', () => {
    const provider = anchor.AnchorProvider.local();
    anchor.setProvider(provider);
    const calculator = anchor.web3.Keypair.generate();
    const program = anchor.workspace.Mycalculatordapp;

    it('Creates a calculator', async() => {
        await program.rpc.create('Welcome to Solana', {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId
            },
            signers: [calculator]
        });
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.greeting === 'Welcome to Solana');
    })

    it('Adds two numbers', async() => {
        await program.rpc.add(new anchor.BN(2), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        });
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(5)));
    })

    it('Substracts two numbers', async() => {
        await program.rpc.substract(new anchor.BN(5), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        });
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(2)));
    })

    it('Multiplies two numbers', async() => {
        await program.rpc.multiply(new anchor.BN(5), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        });
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(15)));
    })

    it('Divides two numbers', async() => {
        await program.rpc.divide(new anchor.BN(16), new anchor.BN(3), {
            accounts: {
                calculator: calculator.publicKey
            }
        });
        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new anchor.BN(5)) && account.remainder.eq(new anchor.BN(1)));
    })
})