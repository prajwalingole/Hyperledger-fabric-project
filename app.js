'use strict';

const express = require('express');
var cors = require('cors')
const utf8Decoder = new TextDecoder('utf-8');

const app = express();
app.use(express.json())
app.use(cors())
const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {
	buildCAClient,
	registerAndEnrollUser,
	enrollAdmin,
} = require('./CAUtil.js');
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require('./AppUtil.js');

const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';

const mspOrg1 = 'Org1MSP';
const mspOrg2 = 'Org2MSP';

const org1UserId = 'org1User';
const org2UserId = 'org2User';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function setupGateway(orgMspId, userId, caUrl, affiliation) {
	let ccp;
	let walletPath;
	if (orgMspId === mspOrg1) {
		walletPath = path.join(__dirname, 'wallet1');
		ccp = buildCCPOrg1();
	} else if (orgMspId === mspOrg2) {
		walletPath = path.join(__dirname, 'wallet2');
		ccp = buildCCPOrg2();
	} else {
		throw new Error(`Invalid organization MSP ID: ${orgMspId}`);
	}

	const caClient = buildCAClient(FabricCAServices, ccp, caUrl);
	const wallet = await buildWallet(Wallets, walletPath);
	await enrollAdmin(caClient, wallet, orgMspId);
	await registerAndEnrollUser(caClient, wallet, orgMspId, userId, affiliation);

	const gateway = new Gateway();
	await gateway.connect(ccp, {
		wallet,
		identity: userId,
		discovery: { enabled: true, asLocalhost: true },
	});
	// console.log("connect here")
	return gateway;
}

async function getContract(orgMspId, userId, caUrl, affiliation) {
	const gateway = await setupGateway(orgMspId, userId, caUrl, affiliation);
	const network = await gateway.getNetwork(channelName);
	const contract = network.getContract(chaincodeName);

	return contract;
}
app.post('/connect', async (req, res) => {
	try {
		const { orgMspId, userId, affiliation } = req.body;
		const orgMSP = `${orgMspId}MSP`;
		const caUrl = `ca.${orgMspId.toLowerCase()}.example.com`;
		const contract = await getContract(orgMSP, userId, caUrl, affiliation);
		await contract.submitTransaction('createAccount', userId, 0);
		const resultBytes = await contract.evaluateTransaction('getBalance', userId);
		const resultJson = utf8Decoder.decode(resultBytes);
		const result = JSON.parse(resultJson);
		console.log(result);
		//   const serializedContract = serializeObject(contract);
		res.status(200).json(result);
	} catch (error) {
		console.error(`Failed to get contract: ${error}`);
		res.status(500).send('Failed to get contract');
	}
});

// app.post('/registerUser', async (req, res) => {
// 	try {
// 		//   console.log(req.body);
// 		const { orgMspId, userId, affiliation } = req.body;
// 		const caUrl = `ca.${orgMspId.toLowerCase()}.example.com`;

// 		const caClient = buildCAClient(FabricCAServices, buildCCPOrg1(), caUrl);
// 		console.log("here")
// 		const wallet = await buildWallet(Wallets, walletPath);
// 		await enrollAdmin(caClient, wallet, "Org1MSP");
// 		await registerAndEnrollUser(caClient, wallet, orgMspId, userId, affiliation);

// 		res.send('User registration successful');
// 	} catch (error) {
// 		console.error(`Failed to register user: ${error}`);
// 		res.status(500).send('Failed to register user');
// 	}
// });

app.post('/transfer', async (req, res) => {
	try {
		const { orgMspId, userId, affiliation, userId2, amount } = req.body;
		const orgMSP = `${orgMspId}MSP`;
		const caUrl = `ca.${orgMspId.toLowerCase()}.example.com`;
		const contract = await getContract(orgMSP, userId, caUrl, affiliation);
		await contract.submitTransaction('transfer', userId, userId2, amount);
		res.send('Transfered successfully');
	} catch (error) {
		console.error(`Failed to submit transaction: ${error}`);
		res.status(500).send('Failed to submit transaction');
	}
});

app.post('/withdraw', async (req, res) => {
	try {
		const { orgMspId, userId, affiliation, amount } = req.body;
		const orgMSP = `${orgMspId}MSP`;
		const caUrl = `ca.${orgMspId.toLowerCase()}.example.com`;
		const contract = await getContract(orgMSP, userId, caUrl, affiliation);
		await contract.submitTransaction('withdraw', userId, amount);
		res.send('Withdraw successful')
	} catch (error) {
		console.error(`Failed to evaluate transaction: ${error}`);
		res.status(500).send('Failed to evaluate transaction');
	}
});

app.post('/deposit', async (req, res) => {
	try {
		const { orgMspId, userId, affiliation, amount } = req.body;
		const orgMSP = `${orgMspId}MSP`;
		const caUrl = `ca.${orgMspId.toLowerCase()}.example.com`;
		const contract = await getContract(orgMSP, userId, caUrl, affiliation);
		await contract.submitTransaction('deposit', userId, amount);
		res.send('Amount deposited succesfully');
	} catch (error) {
		console.error(`Failed to submit transaction: ${error}`);
		res.status(500).send('Failed to submit transaction');
	}
});

app.post('/balance', async (req, res) => {
	try {
		const { orgMspId, userId, affiliation } = req.body;
		const orgMSP = `${orgMspId}MSP`;
		const caUrl = `ca.${orgMspId.toLowerCase()}.example.com`;
		const contract = await getContract(orgMSP, userId, caUrl, affiliation);
		const resultBytes = await contract.evaluateTransaction('getBalance', userId);
		const resultJson = utf8Decoder.decode(resultBytes);
		const result = JSON.parse(resultJson);
		console.log(result);
		res.status(200).json(result);
	} catch (error) {
		console.error(`Failed to evaluate transaction: ${error}`);
		res.status(500).send('Failed to evaluate transaction');
	}
});

app.listen(5000, () => {
	console.log('Server is running on port 5000');
});
