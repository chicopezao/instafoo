const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const chalk = require("chalk");
// Configuração dos sites
const sitesConfig = [
    {
        name: "birtakipci",
        baseUrl: "https://birtakipci.com",
        loginUrl: "https://birtakipci.com/member",
        sendFollowerUrl: "https://birtakipci.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
    name: "takipcimax",
    baseUrl: "https://takipcimax.com",
    loginUrl: "https://takipcimax.com/login",
    sendFollowerUrl: "https://takipcimax.com/tools/send-follower",
    selectors: {
        username: "input[placeholder=\"Kullanıcı adı\"]",
        password: "input[placeholder=\"Şifre\"]",
        loginButton: "button:contains(\"Giriş yap\")", // Sugestão de correção
        targetUsername: "input[placeholder=\"fatihh\"]",
        findUserButton: "button:contains(\"Kullanıcıyı Bul\")", // Sugestão de correção
        followerCount: "input[placeholder=\"50\"]",
        startButton: "button:contains(\"Start\"), button:contains(\"Başla\")", // Sugestão de correção para ambos os textos
        credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
    },
    loginButtonText: "Giriş yap",
    findUserButtonText: "Kullanıcıyı Bul",
    startButtonText: ["Start", "Başla"]
   },
    {
        name: "takipciking_net",
        baseUrl: "https://takipciking.net",
        loginUrl: "https://takipciking.net/login",
        sendFollowerUrl: "https://takipciking.net/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "takipcizen",
        baseUrl: "https://takipcizen.com",
        loginUrl: "https://takipcizen.com/login",
        sendFollowerUrl: "https://takipcizen.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "hepsitakipci",
        baseUrl: "https://www.hepsitakipci.com",
        loginUrl: "https://www.hepsitakipci.com/member",
        sendFollowerUrl: "https://www.hepsitakipci.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "instamoda",
        baseUrl: "https://instamoda.org",
        loginUrl: "https://instamoda.org/login",
        sendFollowerUrl: "https://instamoda.org/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "fastfollow",
        baseUrl: "https://fastfollow.in",
        loginUrl: "https://fastfollow.in/member",
        sendFollowerUrl: "https://fastfollow.in/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "takipcikrali",
        baseUrl: "https://takipcikrali.com",
        loginUrl: "https://takipcikrali.com/login",
        sendFollowerUrl: "https://takipcikrali.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "takipcitime",
        baseUrl: "https://takipcitime.com",
        loginUrl: "https://takipcitime.com/login",
        sendFollowerUrl: "https://takipcitime.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "medyahizmeti",
        baseUrl: "https://medyahizmeti.com",
        loginUrl: "https://medyahizmeti.com/member",
        sendFollowerUrl: "https://medyahizmeti.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "mixtakip",
        baseUrl: "https://mixtakip.com",
        loginUrl: "https://mixtakip.com/login",
        sendFollowerUrl: "https://mixtakip.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button",
            followerCount: "input[placeholder=\"25\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*='credit'], [class*='balance'], [id*='credit'], [id*='balance']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
        {
        name: "takipcigir",
        baseUrl: "https://takipcigir.com",
        loginUrl: "https://takipcigir.com/login",
        sendFollowerUrl: "https://takipcigir.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button[type=\"submit\"]",
            targetUsername: "input[name=\"username\"]",
            findUserButton: "button[type=\"submit\"]",
            followerCount: "input[name=\"adet\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*=\'credit\'], [class*=\'balance\'], [id*=\'credit\'], [id*=\'balance\']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
   {
        name: "canlitakipci",
        baseUrl: "https://canlitakipci.com",
        loginUrl: "https://canlitakipci.com/1e6e5bafaf224e6acb90b497140ada7703f45505", // URL de login atualizada após o clique
        sendFollowerUrl: "https://canlitakipci.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]", // Corrigido
            loginButton: "button:contains(\"Giriş yap\")", // Sugestão de correção
            targetUsername: "input[placeholder=\"fatihh\"]", // Corrigido
            findUserButton: "button:contains(\"Kullanıcıyı Bul\")", // Sugestão de correção
            followerCount: "input[placeholder=\"60\"]", // Corrigido
            startButton: "button:contains(\"Start\"), button:contains(\"Başla\")", // Sugestão de correção para ambos os textos
            credit: ".credit-count, .credits, .balance, .user-credits, [class*=\'credit\'], [class*=\'balance\'], [id*=\'credit\'], [id*=\'balance\']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },

    {
        name: "takipciking_com",
        baseUrl: "https://www.takipciking.com",
        loginUrl: "https://www.takipciking.com/member",
        sendFollowerUrl: "https://www.takipciking.com/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button",
            targetUsername: "input[name=\"username\"]",
            findUserButton: "button[type=\"submit\"]",
            followerCount: "input[name=\"adet\"]",
            startButton: "button",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*=\'credit\'], [class*=\'balance\'], [id*=\'credit\'], [id*=\'balance\']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    },
    {
        name: "takipcivar",
        baseUrl: "https://takipcivar.net",
        loginUrl: "https://takipcivar.net/1e6e5bafaf224e6acb90b497140ada7703f45505", // URL de login após o clique inicial
        sendFollowerUrl: "https://takipcivar.net/tools/send-follower",
        selectors: {
            username: "input[placeholder=\"Kullanıcı adı\"]",
            password: "input[placeholder=\"Şifre\"]",
            loginButton: "button:contains(\"Giriş yap\")",
            targetUsername: "input[placeholder=\"fatihh\"]",
            findUserButton: "button:contains(\"Kullanıcıyı Bul\")",
            followerCount: "input[placeholder=\"50\"]",
            startButton: "button:contains(\"Start\")",
            credit: ".credit-count, .credits, .balance, .user-credits, [class*=\'credit\'], [class*=\'balance\'], [id*=\'credit\'], [id*=\'balance\']"
        },
        loginButtonText: "Giriş yap",
        findUserButtonText: "Kullanıcıyı Bul",
        startButtonText: ["Start", "Başla"]
    }


];

class Logger {
    static info(site, message) {
           console.log(chalk.blue(`[${new Date().toLocaleTimeString()}]`) + chalk.cyan(` [${site}] `) + chalk.white(message));
    }
    
    static success(site, message) {
        console.log(chalk.blue(`[${new Date().toLocaleTimeString()}]`) + chalk.green(` [${site}] ✓ `) + chalk.white(message));
    }
    
    static error(site, message) {
        console.log(chalk.blue(`[${new Date().toLocaleTimeString()}]`) + chalk.red(` [${site}] ✗ `) + chalk.white(message));
    }
    
    static warning(site, message) {
        console.log(chalk.blue(`[${new Date().toLocaleTimeString()}]`) + chalk.yellow(` [${site}] ⚠ `) + chalk.white(message));
    }
    
    static header(message) {
        console.log(chalk.keyword("magenta").bold("\n" + "=".repeat(60)));
        console.log(chalk.hex("#FF00FF").bold(message));
        console.log(chalk.hex("#FF00FF")("=".repeat(60) + "\n")); // mas às vezes precisa de .bold() ou template string
    }
    
    static stats(stats) {
        console.log(chalk.keyword("magenta").bold("\n" + "=".repeat(60)));
        console.log(chalk.hex("#FF00FF").bold("ESTATÍSTICAS FINAIS"));
        console.log(chalk.hex("#FF00FF").bold("=".repeat(60)));
        console.log(chalk.green(`✓ Sites com sucesso: ${stats.success}`));
        console.log(chalk.red(`✗ Sites com erro: ${stats.error}`));
        console.log(chalk.yellow(`⚠ Sites pulados: ${stats.skipped}`));
        console.log(chalk.blue(`📊 Total de sites: ${stats.total}`));
        console.log(chalk.cyan(`📈 Taxa de sucesso: ${((stats.success / stats.total) * 100).toFixed(1)}%`));
        console.log(chalk.hex("#FF00FF")("=".repeat(60) + "\n"));
    }
}

class MultiSiteAutomation {
    constructor(username, password) {
        this.credentials = {
            username: username,
            password: password
        };
        this.browser = null;
        this.page = null;
        this.currentSiteIndex = 0;
        this.sitesConfig = sitesConfig;
        this.stats = {
            success: 0,
            error: 0,
            skipped: 0,
            total: 0
        };
    }

    async initBrowser() {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER;
        
        let browserOptions;
        
        if (isProduction) {
            browserOptions = {
                args: [
                    ...chromium.args,
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ],
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            };
        } else {
            browserOptions = {
                headless: "new",
                executablePath: await chromium.executablePath(),
                args: [
                    ...chromium.args,
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu'
                ]
            };
        }

        this.browser = await puppeteer.launch(browserOptions);
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1366, height: 768 });
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }

    async login(siteConfig) {
        try {
            Logger.info(siteConfig.name, "Iniciando processo de login...");

            Logger.info(siteConfig.name, `Navegando para: ${siteConfig.loginUrl}`);
            await this.page.goto(siteConfig.loginUrl, { waitUntil: "networkidle2", timeout: 30000 });
            Logger.success(siteConfig.name, "Página de login carregada");

            // Extrair antiForgeryToken se presente
            let antiForgeryToken = "";
            const antiForgeryElement = await this.page.$("input[name=\"antiForgeryToken\"]");
            if (antiForgeryElement) {
                antiForgeryToken = await antiForgeryElement.evaluate(el => el.value);
                Logger.info(siteConfig.name, `antiForgeryToken encontrado: ${antiForgeryToken}`);
            }

            await this.page.waitForSelector(siteConfig.selectors.username, { timeout: 10000 });
            await this.page.type(siteConfig.selectors.username, this.credentials.username);
            await this.page.type(siteConfig.selectors.password, this.credentials.password);

            Logger.info(siteConfig.name, "Credenciais preenchidas, submetendo formulário...");
            
            const form = await this.page.$("form");
            if (form) {
                await Promise.all([
                    this.page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => {}),
                    form.evaluate(form => form.submit())
                ]);
            } else {
                const loginButton = await this.page.evaluateHandle((buttonText) => {
                    const buttons = Array.from(document.querySelectorAll("button"));
                    return buttons.find(button => button.textContent.includes(buttonText));
                }, siteConfig.loginButtonText);

                if (!loginButton) {
                    throw new Error("Botão de login ou formulário não encontrado.");
                }

                await Promise.all([
                    this.page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => {}),
                    loginButton.click()
                ]);
            }

            Logger.success(siteConfig.name, "Login realizado com sucesso!");
            return true;

        } catch (error) {
            Logger.error(siteConfig.name, `Erro durante o login: ${error.message}`);
            return false;
        }
    }

   async getFollowerCredits(siteConfig) {
        try {
            Logger.info(siteConfig.name, `Navegando para: ${siteConfig.sendFollowerUrl}`);
            await this.page.goto(siteConfig.sendFollowerUrl, { waitUntil: "networkidle2", timeout: 30000 });
            Logger.success(siteConfig.name, "Página de envio de seguidores carregada");
            
            try {
                await this.page.waitForSelector(siteConfig.selectors.credit, { timeout: 10000 });
                const credits = await this.page.$eval(siteConfig.selectors.credit, el => parseInt(el.textContent.trim(), 10));
                Logger.info(siteConfig.name, `Créditos disponíveis: ${credits}`);
                return credits;
            } catch (error) {
                // Tentar seletores alternativos para créditos
                const alternativeSelectors = [
                    '.balance',
                    '.credit',
                    '.credits',
                    '[class*="credit"]',
                    '[class*="balance"]',
                    '[id*="credit"]',
                    '[id*="balance"]',
                    '.user-balance',
                    '.user-credit'
                ];
                
                for (const selector of alternativeSelectors) {
                    try {
                        await this.page.waitForSelector(selector, { timeout: 2000 });
                        const credits = await this.page.$eval(selector, el => parseInt(el.textContent.trim(), 10));
                        if (!isNaN(credits)) {
                            Logger.info(siteConfig.name, `Créditos disponíveis: ${credits}`);
                            return credits;
                        }
                    } catch (e) {
                        continue;
                    }
                }
                
                Logger.warning(siteConfig.name, "Créditos não encontrados, assumindo 0");
                return 0;
            }
        } catch (error) {
            Logger.error(siteConfig.name, `Erro ao obter créditos: ${error.message}`);
            return 0;
        }
    }

    async sendFollowers(siteConfig, targetUsername, followerCount = 500) {
        try {
            Logger.info(siteConfig.name, `Iniciando envio de ${followerCount} seguidores para ${targetUsername}...`);
            
            await this.page.goto(siteConfig.sendFollowerUrl, { waitUntil: "networkidle2", timeout: 30000 });
            Logger.success(siteConfig.name, "Página de envio carregada");

            // Aguardar e preencher o campo de usuário alvo
            await this.page.waitForSelector(siteConfig.selectors.targetUsername, { timeout: 10000 });
            await this.page.type(siteConfig.selectors.targetUsername, targetUsername);

            Logger.info(siteConfig.name, `Procurando usuário: ${targetUsername}`);
            
            // Encontrar o botão "Kullanıcıyı Bul"
            const findUserButton = await this.page.evaluateHandle((buttonText) => {
                const buttons = Array.from(document.querySelectorAll("button"));
                return buttons.find(button => button.textContent.includes(buttonText));
            }, siteConfig.findUserButtonText);

            if (findUserButton) {
                await Promise.all([
                    this.page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }).catch(() => {}),
                    findUserButton.click()
                ]);
                Logger.success(siteConfig.name, "Usuário encontrado");
            }

            // Preencher quantidade de seguidores
            try {
                await this.page.waitForSelector(siteConfig.selectors.followerCount, { timeout: 10000 });
                await this.page.evaluate((count, selector) => {
                    const input = document.querySelector(selector);
                    if (input) {
                        input.value = '';
                        input.value = count.toString();
                    }
                }, followerCount, siteConfig.selectors.followerCount);
            } catch (error) {
                // Tentar seletores alternativos para o campo de quantidade
                const alternativeSelectors = [
                    'input[type="number"]',
                    'input[name*="count"]',
                    'input[name*="amount"]',
                    'input[placeholder*="50"]',
                    'input[placeholder*="100"]',
                    'input[placeholder*="25"]'
                ];
                
                let found = false;
                for (const selector of alternativeSelectors) {
                    try {
                        await this.page.waitForSelector(selector, { timeout: 2000 });
                        await this.page.evaluate((count, sel) => {
                            const input = document.querySelector(sel);
                            if (input) {
                                input.value = '';
                                input.value = count.toString();
                            }
                        }, followerCount, selector);
                        found = true;
                        break;
                    } catch (e) {
                        continue;
                    }
                }
                
                if (!found) {
                    Logger.warning(siteConfig.name, "Campo de quantidade não encontrado, continuando sem definir quantidade específica");
                }
            }

            Logger.info(siteConfig.name, `Quantidade definida: ${followerCount} seguidores`);

            // Encontrar e clicar no botão de início
            const startButton = await this.page.evaluateHandle((buttonTexts) => {
                const buttons = Array.from(document.querySelectorAll("button"));
                return buttons.find(button => 
                    buttonTexts.some(text => button.textContent.includes(text))
                );
            }, siteConfig.startButtonText);

            if (startButton) {
                await startButton.click();
                Logger.success(siteConfig.name, `Processo de envio iniciado! ${followerCount} seguidores enviados para ${targetUsername}`);
                return true;
            } else {
                throw new Error("Botão de início não encontrado");
            }

        } catch (error) {
            Logger.error(siteConfig.name, `Erro durante envio de seguidores: ${error.message}`);
            return false;
        }
    }

    async processSite(siteConfig, targetUsername, followerCount) {
        this.stats.total++;
        
        try {
            Logger.header(`PROCESSANDO SITE: ${siteConfig.name.toUpperCase()}`);
            
            const loginSuccess = await this.login(siteConfig);
            if (!loginSuccess) {
                this.stats.error++;
                return false;
            }

            const credits = await this.getFollowerCredits(siteConfig);


            const sendSuccess = await this.sendFollowers(siteConfig, targetUsername, followerCount);
            if (sendSuccess) {
                this.stats.success++;
                return true;
            } else {
                this.stats.error++;
                return false;
            }

        } catch (error) {
            Logger.error(siteConfig.name, `Erro geral: ${error.message}`);
            this.stats.error++;
            return false;
        }
    }

    async runOneCycle(targetUsername, followerCount) {
    Logger.header(`AUTOMAÇÃO MULTI-SITE (${this.credentials.username}) INICIADA`);
    Logger.info("SISTEMA", `Usuário alvo: ${targetUsername}`);
    Logger.info("SISTEMA", `Seguidores por site: ${followerCount}`);
    Logger.info("SISTEMA", `Total de sites: ${this.sitesConfig.length}`);

    for (const siteConfig of this.sitesConfig) {
        await this.processSite(siteConfig, targetUsername, followerCount);

        // Aguardar 3 segundos entre sites
        Logger.info("SISTEMA", "Aguardando 3 segundos antes do próximo site...");
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Mostrar estatísticas depois de terminar os 15 sites
    Logger.stats(this.stats);

    // Resetar estatísticas para o próximo ciclo
    this.stats = { success: 0, error: 0, skipped: 0, total: 0 };
}
}
module.exports = MultiSiteAutomation;

            
