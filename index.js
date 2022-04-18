const { Octokit } = require("@octokit/core")
const github = require('@actions/github')
const core = require('@actions/core')
var base64 = require('base-64')
const fs = require('fs')
const githubToken = core.getInput('github-token')
const branch = core.getInput('branch')

function run(){
    if(githubToken){
        let file = core.getInput('file')
        if (file){
            let fileRead = fs.readFileSync(`./${file}`, 'utf8').toString()
            let fileBase64 = base64.encode(fileRead)
            uploadGithub(fileBase64, `${file}`)
        }else{
            core.setFailed("Error: O parametro file não foi informado")
        }
    }else{
        core.setFailed("Error: O parametro github-token não foi informado")
    }
}
async function getSHA(owner, repository, fileName){
    let param = {
        owner: owner,
        repo: repository,
        path: fileName,
    }
    if(branch && branch != ''){
        param['ref'] = branch
    }

    const octokit = new Octokit({ auth: githubToken})
    return  octokit.request('GET /repos/{owner}/{repo}/contents/{path}', param, (response)=>{
        return response.data.sha
    }).catch((error)=>{
        return error.status
    })
}



async function loadContentBase64(fileName, content){
    let owner = github.context.payload.repository.owner.name
    let repository = github.context.payload.repository.name
    let param
    let sha = await getSHA(owner, repository, fileName)        
    param = {
        owner: owner,
        repo: repository,
        path: fileName,
        message: `ci: Update ${fileName}`,
        content: content,
        sha: sha
    }
    if(branch && branch != ''){
        param['branch'] = branch
    }

    return param
}

async function uploadFileBase64(param, fileName){
    
    const octokit = new Octokit({ auth: githubToken})
    await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', param).then(()=>{
        console.log("Upload arquivo: ", fileName)
        let message = param.sha != 404 ? 'Arquivo atualizado' : 'Arquivo criado'
        console.log({
            'statusCode':param.sha != 404 ? 200 : 201,
            'headers': {
                'Content-Type': 'application/json',
            },
            'body': {
                'message': message,
            }
        })
        core.setOutput("success", message)
        
    }).catch(function(error){
        core.setFailed("Error ao commitar file: ",error)
    })
}

async function uploadGithub(content, fileName){
    let param = await loadContentBase64(fileName, content)    
    
    if(param.sha != 404){
        if(param.sha != 404)
            param["sha"] = param.sha.data.sha
    }
    uploadFileBase64(param, fileName)
}

run()