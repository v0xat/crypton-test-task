# Solidity test task

Контракт в Rinkeby - https://rinkeby.etherscan.io/address/0x1eFBC623d481227657726122EAE6E7356BC715fE


Написать смарт контракт для приема пожертвований в виде нативной валюты (ETH, BNB, MATIC)

Основной функционал:  
- Внести пожертвование (msg.value);
- Вывести пожертвование на определенный адрес. Данное действие может сделать только создатель контракта;
- Хранить адреса всех пользователей сделавших пожертвование;
- Хранить суммы пожертвований для каждого пользователя.

Написать unit test

Доп задание:  
- Написать скрипт deloy в тестовую сеть rinkeby
- Написать таски для сети rinkeby

### Для запуска:
1. `npm install`
2. Тесты - `npx hardhat test`
3. Создать `.env` файл с переменными `ALCHEMY_API_KEY`, `RINKEBY_PRIVATE_KEY`, `RINKEBY_OWNER_ADDRESS`
 и `RINKEBY_CONTRACT_ADDRESS`
4. Деплой в rinkeby - `npx hardhat run scripts/deploy.js --network rinkeby`
5. Таск для сети Rinkeby (пополняет контракт на 0.0005 eth и вызывает withdrawTo на адрес владельца) - `npx hardhat interact --address <адрес контракта в Rinkeby>`