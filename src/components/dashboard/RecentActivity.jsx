
import { useState, useEffect } from 'react'

import apiFetch from '../../services/api'

import './RecentActivity.css'

function RecentActivity() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchActivities() {
      try {
        const response = await apiFetch('/activities')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Erreur de chargement')
        }

        setActivities(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [])

  function formatDate(date) {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3>Activité récente</h3>
        <span>10 dernières opérations</span>
      </div>

      {loading && <p>Chargement des activités...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && activities.length === 0 && (
        <p>Aucune activité enregistrée.</p>
      )}

      {!loading && !error && activities.length > 0 && (
        <table className="activity-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Action</th>
              <th>Utilisateur</th>
              <th>Date</th>
              <th>Statut</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id}>
                <td>{activity.product}</td>
                <td>{activity.action}</td>
                <td>{activity.user || '—'}</td>
                <td>{formatDate(activity.createdAt)}</td>
                <td>
                  <span className="activity-status completed">
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default RecentActivity
