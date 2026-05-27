const chalk = require('chalk');
const { execSync } = require('child_process');

// Função para executar comandos sem mostrar a saída
const execSilent = (command) => {
    try {
        execSync(command, { stdio: 'ignore' }); // Redireciona stdout e stderr para "nada"
    } catch (error) {
        if (command === 'npm run prettier' || error.message.includes('github.com')) return;
        process.exit(1);
    }
};

// Obter o nome da branch
const BRANCH = execSync('git symbolic-ref --short HEAD').toString().trim();

// Regex corrigido
const REGEX = /^(feat|bugfix|hotfix)\/([a-zA-Z0-9-]+)$/;

// Exibição do título do hook
console.log(
    chalk.white.bold(
        '\n╔══════════════════════════════════╗\n' +
            '║ ' +
            chalk.blue.bold('   🧙 TableRise Push Hook 🌙') +
            '     ║\n' +
            '╚══════════════════════════════════╝'
    )
);

try {
    console.log(chalk.magenta('👾 Executando audit...'));
    execSilent('npm run audit');
} catch (error) {
    console.log(chalk.red('❌ Existem bibliotecas vulneráveis'));
    process.exit(1);
}

try {
    console.log(chalk.magenta('🔬 Executando lint...'));
    execSilent('npm run lint');
} catch (error) {
    console.log(chalk.red('❌ É necessária a correção do linter'));
    process.exit(1);
}

try {
    console.log(chalk.magenta('👑 Executando prettier...'));
    execSync('npm run prettier --max-warnings=0');
    console.log(chalk.green('✅ Todos os arquivos já estão formatados corretamente!'));
} catch (error) {
    console.log(chalk.yellow('⚠️  Corrigindo o Prettier...'));
    execSilent('npm run prettier:fix');
    execSilent('git add .');
    execSilent('git commit -m "fix: prettier"');
    execSilent('git push -u origin ' + BRANCH);
    console.log(chalk.green('✅ Prettier corrigido e alterações enviadas.'));
}

// Verificação do nome da branch
if (!REGEX.test(BRANCH)) {
    console.log(chalk.red('========================'));
    console.log('');
    console.log(chalk.red('❌ Seu push foi rejeitado devido ao nome da branch'));
    console.log('');
    console.log(chalk.blue('💡 Por favor, renomeie sua branch utilizando a sintaxe:'));
    console.log(chalk.green('(feat|bugfix|hotfix)/task-id/branch-objective'));
    console.log(chalk.red('🚫 Pushes nas branches develop, main ou qa não são permitidos.'));
    console.log('');
    console.log(chalk.red('========================'));
    process.exit(1);
}

// Sucesso
console.log(chalk.green('✅ Tudo certo! Push permitido.'));
