import '../assets/sass/card.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CardDetails from './CardDetails'
import CardHighlights from './CardHighlights'
import {
    fetchFullText,
    deleteFullText,
    setFullTextDetails,
    addToFavorites,
    removeFromFavorites,
} from '../store/actions'

class Card extends Component {
    state = {
        activeDetails: false,
        activeFavorite: false,
    }

    componentDidMount() {
        if (this.props.result._id in this.props.favorites) {
            this.setState({ activeFavorite: true })
        }
    }

    handleDetails = e => {
        e.preventDefault()
        this.setState({ activeDetails: !this.state.activeDetails })
    }

    handleSelectedText = (result, e) => {
        e.preventDefault()
        if (this.props.textActive) {
            this.props.deleteFullText()
        } else {
            if (result.highlight.tibtext) {
                this.props.fetchFullText(this.props.term, result)
            } else {
                this.props.setFullTextDetails(result)
            }
        }
    }

    handleFavorites = (result, e) => {
        e.preventDefault()
        this.setState({ activeFavorite: !this.state.activeFavorite }, () => {
            if (this.state.activeFavorite) {
                this.props.addToFavorites(result)
            } else {
                this.props.removeFromFavorites(result._id)
            }
        })
    }

    render() {
        const activatedDetails = this.state.activeDetails ? 'make-visible' : ''
        const activatedFavorite = this.state.activeFavorite
            ? 'favorites-active'
            : 'favorites'
        const activatedText = this.props.textActive ? 'text-active' : ''
        const { result, type, term } = this.props

        return (
            <React.Fragment>
                <div className="card-content blue-grey-text darken-4">
                    <div className="result-meta">
                        <span>ID: {result._id} </span>
                        <span>Score: {result._score}</span>
                    </div>
                    <CardHighlights type={type} result={result} />
                </div>
                <div className="card-action">
                    <a href="#!" onClick={e => this.handleDetails(e)}>
                        {this.state.activeDetails
                            ? 'Hide Details'
                            : 'Show Details'}
                    </a>
                    <a
                        href="#!"
                        onClick={e => this.handleFavorites(result, e)}
                        className="favorites right"
                    >
                        <i
                            className={`fal fa-star fa-lg ${activatedFavorite}`}
                        />
                    </a>
                    {type === 'texts' ? (
                        <a
                            key={result._id}
                            href="#!"
                            onClick={e => this.handleSelectedText(result, e)}
                            className="text right"
                        >
                            <i
                                className={`fal fa-file-alt fa-lg ${activatedText}`}
                            />
                        </a>
                    ) : null}

                    <div
                        className={`more-content ${activatedDetails} blue-grey-text darken-4`}
                    >
                        <CardDetails result={result} term={term} />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    favorites: state.favorites,
    selectedText: state.selectedText,
    term: state.currentSearchTerm,
})

export default connect(
    mapStateToProps,
    {
        addToFavorites,
        removeFromFavorites,
        fetchFullText,
        deleteFullText,
        setFullTextDetails,
    }
)(Card)
