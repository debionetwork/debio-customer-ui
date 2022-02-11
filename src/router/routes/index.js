import CustomerRoutes from "./customer"
import GeneticAnalystRoutes from "./geneticAnalyst"

const indexRoutes = [
  ...CustomerRoutes,
  ...GeneticAnalystRoutes
]

export default indexRoutes
