// GitHub Contents client: no credentials in source, commits or save payloads.
class GitHubSaveClient {
 constructor(token,transport=window.fetch?.bind(window)){this.token=token;this.transport=transport;this.shas={};this.base='https://api.github.com/repos/Ray0308/kyoryu-island/contents/';this.branch='codex/save-data'}
 static encode(value){return btoa(encodeURIComponent(JSON.stringify(value)).replace(/%([0-9A-F]{2})/g,(_,h)=>String.fromCharCode(parseInt(h,16))))}
 static decode(value){return JSON.parse(decodeURIComponent(Array.from(atob(value.replace(/\s/g,'')),c=>'%'+c.charCodeAt(0).toString(16).padStart(2,'0')).join('')))}
 async request(path,options={}){if(!this.transport)throw Error('通信できません');const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),8000);let response;try{response=await this.transport(this.base+path,{...options,signal:controller.signal,headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',Authorization:'Bearer '+this.token,...options.headers}})}catch{throw Error('通信できません。端末の記録は残っています')}finally{clearTimeout(timeout)}
 if(!response.ok){const error=Error(response.status===401?'保存用の鍵が無効です':response.status===403?'書き込み権限または利用制限を確認してください':response.status===404?'保存先または読み書きの権限を確認してください':response.status===409||response.status===422?'ほかの端末で更新されています。読み込み直してください':'GitHub保存に失敗しました');error.status=response.status;throw error}return response.json()}
 async read(kind){try{const file=await this.request('data/'+kind+'.json?ref='+encodeURIComponent(this.branch));if(file.size>1000000)throw Error('セーブのサイズが大きすぎます');return {sha:file.sha,data:GitHubSaveClient.decode(file.content)}}catch(error){if(error.status===404)return {sha:null,data:null};throw error}}
 async write(kind,data){const latest=await this.read(kind);if(latest.sha!==(this.shas[kind]??null)){const error=Error('ほかの端末で更新されています。GitHubから読み込んでください');error.status=409;throw error}
 const result=await this.request('data/'+kind+'.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:(kind==='progress'?'Save game progress':'Update custom stages')+' [skip ci]',branch:this.branch,content:GitHubSaveClient.encode(data),...(latest.sha?{sha:latest.sha}:{})})});this.shas[kind]=result.content.sha;return this.shas[kind]}
}
window.GitHubSaveClient=GitHubSaveClient;
