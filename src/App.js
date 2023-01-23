import {Component} from 'react'

import Loader from 'react-loader-spinner'

import ProjectCard from './components/ProjectCard'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    videosData: [],
    apiStatus: apiStatusConstants.initial,
    optionId: 'ALL',
  }

  componentDidMount() {
    this.getVideosData()
  }

  getVideosData = async () => {
    const {optionId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${optionId}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        videosData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {videosData} = this.state
    return (
      <div className="project-card-container">
        <ul className="un-ordered-card-container">
          {videosData.map(each => (
            <ProjectCard key={each.id} projectDetails={each} />
          ))}
        </ul>
      </div>
    )
  }

  onClickRetry = () => {
    this.getVideosData()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-head">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-button"
        type="button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height={50} width={50} />
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  onChangeOption = event => {
    this.setState({optionId: event.target.value}, this.getVideosData)
  }

  render() {
    const {optionId} = this.state
    return (
      <div className="project-container">
        <nav className="image-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </nav>
        <div className="main-container">
          <ul className="un-ordered-container">
            <select
              className="select"
              value={optionId}
              onChange={this.onChangeOption}
            >
              {categoriesList.map(each => (
                <option key={each.id} value={each.id}>
                  {each.displayText}
                </option>
              ))}
            </select>
          </ul>
          {this.renderProjects()}
        </div>
      </div>
    )
  }
}

export default App
