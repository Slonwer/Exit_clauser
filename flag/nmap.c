#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Função para simular a execução de uma consulta SQL
void execute_query(char *query) {
    printf("Executando a consulta SQL: %s\n", query);
    // Aqui você pode adicionar o código para executar a consulta no banco de dados
    // Por exemplo, uma chamada para uma biblioteca de acesso ao banco de dados como MySQL ou SQLite
    // Se necessário, lembre-se de escapar caracteres especiais para evitar injeção de SQL
}

int main() {
    char input[100];

    printf("Digite o nome do usuário: ");
    scanf("%s", input);

    // Construir a consulta SQL com base na entrada do usuário
    char query[200];
    sprintf(query, "SELECT * FROM users WHERE username='%s'", input);

    // Executar a consulta SQL
    execute_query(query);

    return 0;
}
