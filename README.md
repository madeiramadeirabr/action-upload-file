![img](https://github.com/madeiramadeirabr/action-upload-file/blob/production/img/action-upload-file.svg)
# action-upload-file

## description
 Esta action envia o arquivo gerado em tempo de execução para o repositório, se o arquivo gerado em tempo de execução já existir a action atualizará o mesmo, se não existir a action criará o arquivo

 ## Squad
[SRE Team](https://github.com/orgs/madeiramadeirabr/teams/team-platform-services 'SRE Team')

## Requisitos:
São necessários informar os parâmetros `github-token` e `file`

## Exemplos de uso:
```yml
uses: madeiramadeirabr/action-upload-file@production
with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    file: changelog.md
```

> Observação: Se deseja fazer o upload do arquivo na branch padrão não é necessário informar o parâmetro `branch`
### Or

```yml
uses: madeiramadeirabr/action-upload-file@production
with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    file: changelog.md
    branch: main
```
> Observação: Se deseja fazer o upload do arquivo em uma branch que não seja a padrão é necessário informar o parâmetro `branch`