import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"
const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      try {
        const { search } = req.query
        const tasks = database.select("tasks", search ? {
          title: search,
          description: search
        } : null)

        return res.end(JSON.stringify(tasks))
      } catch (err) {
        console.error(err)
        res.writeHead(500).end("Server error")
      }

    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      try {
        if (!req.body.title || !req.body.description) {
          throw new Error("Title and description is required")
        }

        const task = {
          id: randomUUID(),
          title: req.body.title,
          description: req.body.description,
          completed_at: null,
          created_at: new Date(),
          updated_at: new Date()
        }

        database.insert("tasks", task)

        return res
          .writeHead(201)
          .end()
      } catch (err) {
        console.error(err)
        res.writeHead(500).end("Server error")
      }

    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params

        const [task] = database.select('tasks', { id })
        if (!task) {
          return res.writeHead(404).end()
        }

        database.delete("tasks", id)
        res.writeHead(204).end()
      } catch (err) {
        console.error(err)
        res.writeHead(500).end("Server error")
      }

    }
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      try {
        const { id } = req.params
        const [task] = database.select('tasks', { id })
        if (!task) {
          return res.writeHead(404).end()
        }

        if (!req.body.title || !req.body.description) {
          throw new Error("Title and description is required")
        }

        const { title, description } = req.body

        database.update("tasks", id, {
          title,
          description,
          updated_at: new Date()
        })
        res.writeHead(204).end()
      } catch (err) {
        console.error(err)
        res.writeHead(500).end("Server error")
      }

    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      try {
        const { id } = req.params

        const [task] = database.select('tasks', { id })
        if (!task) {
          return res.writeHead(404).end()
        }

        database.update("tasks", id, {
          updated_at: new Date(),
          completed_at: new Date()
        })
        res.writeHead(204).end()
      } catch (err) {
        console.error(err)
        res.writeHead(500).end("Server error")
      }

    }
  }
]