import React, { Component } from 'react';

class FeeSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      priority: false
    };

    this.formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  handleClick = () => {
    this.setState({ priority: !this.state.priority });
  };

  render() {
    const { estimatedGas, network, priceUSD } = this.props;

    if (!this.props.estimatedGas) {
      return <div>Loading...</div>;
    }

    const gas = web3.utils.isHex(estimatedGas)
      ? new BigNumber(web3.utils.hexToNumberString(estimatedGas))
      : new BigNumber(estimatedGas);
    const gasEtherAmount = gas.dividedBy(1000000000);
    const gasEtherAmountPriority = gasEtherAmount.times(2);

    let fee;
    if (!this.state.priority) {
      if (network.toLowerCase() === 'main' && priceUSD) {
        const standardFee = gasEtherAmount.times(priceUSD);
        const formattedFee = this.formatter.format(standardFee);
        fee = `${formattedFee} USD`;
      } else {
        fee = `${gasEtherAmount} ETH`;
      }
    } else {
      if (network.toLowerCase() === 'main' && priceUSD) {
        const priorityFee = gasEtherAmountPriority.times(priceUSD);
        const formattedFee = this.formatter.format(priorityFee);
        fee = `${formattedFee} USD`;
      } else {
        fee = `${gasEtherAmountPriority} ETH`;
      }
    }

    if (this.state.priority) {
      return (
        <div className="fee-selector">
          <span
            onClick={this.handleClick}
            className="fee-selector__btn"
            data-tooltip="Click For Standard Fee"
          >
            Priority Fee:
          </span>{' '}
          <span className="fee-amount">{fee}</span>
        </div>
      );
    }

    return (
      <div className="fee-selector">
        <span
          onClick={this.handleClick}
          className="fee-selector__btn"
          data-tooltip="Click For Priority Fee"
        >
          Standard Fee:
        </span>{' '}
        <span className="fee-amount">{fee}</span>
      </div>
    );
  }
}

export default FeeSelector;
