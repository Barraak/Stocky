
import './StatCard.css'

function StatCard({ title, value, description, icon }) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">
        <span className="stat-title">{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>

      <h2 className="stat-value">{value}</h2>

      <p className="stat-description">{description}</p>

    </div>
  )
}

export default StatCard
