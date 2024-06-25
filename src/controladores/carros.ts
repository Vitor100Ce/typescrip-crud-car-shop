import { Request, Response } from 'express'
import { knex } from '../bancodedados/conexao'
import { Carro } from '../tipos'

export const listarCarros = async (_: Request, res: Response) => {

    try {

        const carros = await knex<Carro>('carros')
        return res.status(200).send(carros)

    } catch(error) {
        console.log(error)
        return res.status(500).json({mensagem: 'Erro interno no servidor.'}) 
    }

}

export const detalharCarros = async (req: Request, res: Response) => {

    const { id } = req.params

    try {

        const carro = await knex<Carro>('carros').where({id: Number(id)}).first()

        if (!carro) {
            return res.status(404).json({mensagem: 'Carro não encontrado.'})
        }
        
      return res.json(carro)

    } catch(error) {
        console.log(error)
        return res.status(500).json({mensagem: 'Erro interno no servidor.'}) 
    }

}

export const cadastrarCarros = async (req: Request, res: Response,) => {

    console.log(req.body)

    const { marca, modelo, cor, ano, valor } = req.body

    try {

        const carro = await knex<Omit<Carro,'id'>>('carros').insert({
            marca,
            modelo,
            cor,
            ano,
            valor
        }).returning('*')

        return res.status(201).json(carro[0])

    } catch (error) {
        console.log(error)
        return res.status(500).json({mensagem: 'Erro interno no servidor.'}) 
    
    }
}

export const atualizarCarros = async (req: Request, res: Response) => {

    const { id } = req.params
    const { marca, modelo, cor, ano, valor } = req.body

    try {

        const carro = await knex<Carro>('carros').where({id: Number(id)}).first()

        if (!carro) {
            return res.status(404).json({mensagem: 'Carro não encontrado.'})
        }

        await knex<Carro, 'id'>('carros').update({
            marca, 
            modelo, 
            cor, 
            ano, 
            valor
        }).where({ id: Number(id)})
        
        return res.status(204).json({mensagem: 'Carro atualizado com sucesso'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({mensagem: 'Erro interno no servidor'})
        
    }
}

export const excluirCarros = async (req: Request, res: Response) => {
      
    const { id } = req.params

    try {

        const carro = await knex<Carro>('carros').where({id: Number(id)}).first()

        if (!carro) {
            return res.status(404).json({mensagem: 'Carro não encontrado.'})
        }

        await knex<Carro>('carros').delete().where({id : Number(id)})

        return res.status(200).json({mensagem: 'Carro deletado com sucesso'})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({mensagem: 'Erro interno no servidor'})
        
    }

}







