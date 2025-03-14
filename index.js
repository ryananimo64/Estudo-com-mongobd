const express = require("express");
const helmet = require("helmet");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("combined"));

const urldb = `mongodb+srv://senac:123senac@principal.zgg8g.mongodb.net/banco_minusculo?retryWrites=true&w=majority&appName=Principal`;
mongoose.connect(urldb,{useNewUrlParser:true, useUnifiedTopology:true});

const schema = new mongoose.Schema({
    nome:{type:String,require:true},
    email:{type:String,unique:true,required:true},
    cpf:{type:String,unique:true,required:true},
    telefone:{type:String},
    idade:{type:Number,min:16,max:120},
    usuario:{type:String,unique:true},
    senha:{type:String},
    datacadastro:{type:Date,default:Date.now}
})

const Cliente = mongoose.model('Cliente',schema);

app.get("/", (req, res)=>{
    Cliente.find().then((result)=>{
        res.status(200).send({output:"ok",payload:result});
    })
    .catch((erro)=>{
        res.status(500).send({output:`Erro ao processar dados -> ${erro}`});
    })
   
});

app.post("/cadastro", (req,res)=>{
    const dados = new Cliente(req.body);
    dados.save().then((result)=>{
        res.status(201).send({output:"Cadastro Realizado",payload:result});
    })
    .catch((erro) => res.status(500).send({ output: `Erro ao cadastrar -> ${erro}`}));
});
app.put("/atualizar/:id",(req,res)=>{
    Cliente.findByIdAndUpdate(req.params.id,req.body,{new:true}).then((result)=>{
        if(!result){
            res.status(400).send({output:`Não foi possivel atualizar`});
        }
        res.status(202).send({output:`atualizado`,payload:result});
    }).catch((erro)=> res.status(500).send({ output: `Erro ao processar a solicitação -> ${erro}`}))
    
});

app.delete("/apagar/:id", (req,res)=>{
    Cliente.findByIdAndDelete(req.params.id).then((result)=>{
        res.status(204).send({payload:result});
    }).catch((erro)=> console.log(`Erro ao tentar apagar -> ${erro}`));
    
});

app.use((req,res)=>{
    res.type("application/json");
    res.status(404).send("404 - Not Found");
});

app.listen(3000, () => console.log(`servidor online. em http://127.0.0.1:3000`));