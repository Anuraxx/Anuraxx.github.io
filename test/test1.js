class Test{
  constructor(){}

  async getMsg(){
    return new Promise(resolve=>{
      resolve(this.getFullMsg());
    })
  }
  async getFullMsg(){
    return new Promise(resolve=>{
      resolve(this);
    })
  }
}

export const test = new Test();