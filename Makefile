install: install-deps

start-backend:
	npx hardhat node

deploy-local:
	npx hardhat run scripts/deploy.js --network localhost

deploy-rinkeby:
	npx hardhat run scripts/deploy.js --network rinkeby

start-frontend:
	cd frontend && npm start

install-deps:
	npm ci

test:
	npx hardhat test

.PHONY: test