import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
        return (
            <div>
                <table className="table table-bordered">
                    <tbody>
                        {
                            Object.entries(this.props.emotions).map(function (eventDetails) {
                                return (<tr>
                                    <th scope="row">{eventDetails[0]}</th>
                                    <td>{eventDetails[1]}</td>
                                </tr>)
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }

}
export default EmotionTable;
