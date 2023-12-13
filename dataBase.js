async function connect(){

    if(global.connection)
    return global.connection.connect();

    const {Pool} = require("pg");
    const pool = new Pool ({
        connectionString:process.env.CONNECTION_STRING
    });

    const client = await pool.connect();//cria conexão com banco de dados
    console.log("Criou o pool de conexão");

    //testando se a conexão do banco está correta
    //linha abaixo usa "select now()" que pega a hora do banco de dados
    const res = await client.query("select now()");
    //a hora do banco de dados vêm em um array, usamos a propiedade rows pra pegar 
    //o primeiro indice di array
    console.log(res.rows[0]);
    client.release();//libera a conexão

    global.connection = pool;
    return pool.connect();
}

connect();

async function selectPessoas(){
    const client = await connect();
    const res= await client.query("SELECT * FROM pessoas");
    return res.rows;
}

async function selectPessoa(id){
    const client = await connect();
    const res= await client.query("SELECT * FROM pessoas WHERE ID=$1", [id]);
    return res.rows;
}

module.exports = {
    selectPessoas,
    selectPessoa
}