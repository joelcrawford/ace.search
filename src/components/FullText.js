import '../assets/sass/fulltext.scss'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { parseLines } from '../store/utilities'

class FullText extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentPageIdx: 0,
            initialMatch: true,
            count: 0,
            matchCount: 0,
        }

        this.btnEnables = {
            disableMin: false,
            disableMax: false,
            disableInc: false,
            disableDec: false,
            disableMatchDec: false,
            disableMatchInc: false,
        }
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDowns, false)
        //this.setState({ currentPageIdx: 0 })
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.keyDowns, false)
    }

    keyDowns = e => {
        if (e.key === 'ArrowRight') {
            if (this.state.count < this.props.text.fulltext.length - 1) {
                this.setState({ count: this.state.count + 1 })
            }
        } else if (e.key === 'ArrowLeft') {
            if (this.state.count > 0) {
                this.setState({ count: this.state.count - 1 })
            }
        }
    }

    selectedPage = renderedPageIdx => {
        return this.props.text.fulltext[renderedPageIdx]
    }

    setPage = name => {
        const { termLocations } = this.props.text
        const { matchCount, count } = this.state
        let matchIndex = termLocations.findIndex(id => id === count)

        if (name === 'matchCount') {
            this.setState({
                currentPageIdx: termLocations[matchCount],
                count: termLocations[matchCount],
            })
        } else {
            this.setState({ currentPageIdx: count })
            if (matchIndex > 0) {
                this.setState({ matchCount: matchIndex })
            }
        }
    }

    handleCounter = (e, name, type, referenceNum = 0) => {
        e.preventDefault()
        let max = referenceNum > 0 ? referenceNum - 1 : referenceNum
        switch (type) {
            case 'min':
                this.setState({ [name]: 0 }, () => this.setPage(name))
                break
            case 'max':
                this.setState({ [name]: max }, () => this.setPage(name))
                break
            case 'increase':
                if (name === 'matchCount') {
                    if (this.state.initialMatch) {
                        this.setState({ initialMatch: false })
                        if (
                            this.state.currentPageIdx !==
                            this.props.text.termLocations[0]
                        ) {
                            console.log('setting matchCount to 0')
                            this.setState({ [name]: 0 }, () =>
                                this.setPage(name)
                            )
                        }
                    } else {
                        this.setState(
                            prevState => ({ [name]: prevState[name] + 1 }),
                            () => this.setPage(name)
                        )
                    }
                } else {
                    this.setState(
                        prevState => ({ [name]: prevState[name] + 1 }),
                        () => this.setPage(name)
                    )
                }
                break
            case 'decrease':
                this.setState(
                    prevState => ({ [name]: prevState[name] - 1 }),
                    () => this.setPage(name)
                )
                break
            default:
                break
        }
    }

    setUpMatches = () => {
        const { currentPageIdx } = this.state
        const { termLocations, termOccurrences, fulltext } = this.props.text

        let matches = termOccurrences > 1 ? 'matches' : 'match'
        let msg
        if (termLocations.length > 1) {
            msg = `<em>${this.props.term}</em> ${termOccurrences} ${matches} found on ${termLocations.length} pages.`
        } else {
            msg = `<em>${this.props.term}</em> ${termOccurrences} ${matches} found.`
        }

        let msgSupplement = null
        let btns = null
        if (termLocations.length === 1) {
            let disabledGoToBtn =
                termLocations[0] === currentPageIdx ? 'disabled' : ''
            msgSupplement = (
                <a
                    href="#/"
                    className={`go-to-span ${disabledGoToBtn}`}
                    onClick={e => this.handleCounter(e, 'matchCount', 'min')}
                >
                    {`  GO TO MATCH ${fulltext[termLocations[0]].id}`}
                </a>
            )
        } else {
            btns = (
                <React.Fragment>
                    <a
                        href="#/"
                        className="btn-flat"
                        disabled={this.btnEnables.disableMatchDec}
                        onClick={e =>
                            this.handleCounter(
                                e,
                                'matchCount',
                                'decrease',
                                termLocations.length
                            )
                        }
                    >
                        PREV MATCH
                    </a>
                    <a
                        href="#/"
                        className="btn-flat"
                        disabled={this.btnEnables.disableMatchInc}
                        onClick={e =>
                            this.handleCounter(
                                e,
                                'matchCount',
                                'increase',
                                termLocations.length
                            )
                        }
                    >
                        NEXT MATCH
                    </a>
                </React.Fragment>
            )
        }

        return (
            <div className="full-text-details">
                <p className="meta-item">
                    <span dangerouslySetInnerHTML={{ __html: msg }} />
                    <span>{msgSupplement}</span>
                </p>
                <span className="full-text-details">{btns}</span>
            </div>
        )
    }

    setUpCtls = renderedPageIdx => {
        const { matchCount, count } = this.state
        const { fulltext, termLocations } = this.props.text

        if (fulltext.length === 1) {
            return null
        }

        if (count <= 0) {
            this.btnEnables.disableMin = true
            this.btnEnables.disableDec = true
        } else {
            this.btnEnables.disableMin = false
            this.btnEnables.disableDec = false
        }

        if (count >= fulltext.length - 1) {
            this.btnEnables.disableMax = true
            this.btnEnables.disableInc = true
        } else {
            this.btnEnables.disableMax = false
            this.btnEnables.disableInc = false
        }

        if (matchCount <= 0) {
            this.btnEnables.disableMatchDec = true
        } else {
            this.btnEnables.disableMatchDec = false
        }

        if (matchCount >= termLocations.length - 1) {
            this.btnEnables.disableMatchInc = true
        } else {
            this.btnEnables.disableMatchInc = false
        }

        return (
            <div className="full-text-ctls">
                <a
                    href="#!"
                    disabled={this.btnEnables.disableMin}
                    className="btn-flat"
                    onClick={e => this.handleCounter(e, 'count', 'min')}
                >
                    <i className="fad fa-chevron-double-left" />
                </a>
                <a
                    href="#!"
                    disabled={this.btnEnables.disableDec}
                    className="btn-flat"
                    onClick={e =>
                        this.handleCounter(
                            e,
                            'count',
                            'decrease',
                            fulltext.length
                        )
                    }
                >
                    <i className="fad fa-chevron-left" />
                </a>
                <a
                    href="#!"
                    disabled={this.btnEnables.disableInc}
                    className="btn-flat"
                    onClick={e =>
                        this.handleCounter(
                            e,
                            'count',
                            'increase',
                            fulltext.length
                        )
                    }
                >
                    <i className="fad fa-chevron-right" />
                </a>
                <a
                    href="#!"
                    disabled={this.btnEnables.disableMax}
                    className="btn-flat"
                    onClick={e =>
                        this.handleCounter(e, 'count', 'max', fulltext.length)
                    }
                >
                    <i className="fad fa-chevron-double-right" />
                </a>
                <p className="full-text-pages">
                    {fulltext[renderedPageIdx].id}
                </p>
            </div>
        )
    }

    render() {
        if (!this.props.text || this.props.text.isFetching) {
            return null
        }

        const { fulltext, termLocations } = this.props.text
        const renderedPageIdx = this.state.currentPageIdx || 0
        const selectedPage = this.selectedPage(renderedPageIdx)

        const paginationMsg = `Folios ${fulltext[0].id} to ${fulltext[fulltext.length - 1].id}.`

        return (
            <div className="card grey lighten-3">
                <div className="card-content blue-grey-text darken-4">
                    <p className="result-meta">{`This text has approximately ${fulltext.length} pages. ${paginationMsg}`}</p>
                    {/* <div className="full-text-details">
                        <span className="full-text-details">
                            <i className="fad fa-arrow-right" /> Expandable
                            Details Pane (Coming Soon)
                        </span>
                    </div> */}
                    {termLocations.length && fulltext.length > 0
                        ? this.setUpMatches()
                        : null}

                    {this.setUpCtls(renderedPageIdx)}
                    <div className="flow-text">
                        <p
                            className="full-text"
                            style={{ whiteSpace: 'pre-wrap' }}
                            dangerouslySetInnerHTML={{
                                __html: parseLines(selectedPage.data),
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    text: state.selectedText,
    term: state.currentSearchTerm,
})

export default connect(mapStateToProps)(FullText)
