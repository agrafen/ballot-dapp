import { useEffect, useState } from 'react';
import web3 from 'web3';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import {
  Button,
  Form,
  Grid,
  Icon,
  Header,
  Image,
  Input,
  Message,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { IsConnectedWallet } from '../utils';
import { useCreateContract } from '../hooks';
import BallotContract from '../contract_build/Ballot.json';

let indexAnswers = 1;

export default function NewBallotForm() {
  const [answers, setAnswers] = useState(['answer1']);
  const [newBallotContractAddress, setNewBallotContractAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [deployerBallotContract, signer] = useCreateContract(BallotContract);
  const methods = useForm();
  const { handleSubmit, control, register } = methods;

  const onSubmit = async (formData) => {
    setLoading(true);
    console.log('formData', formData);

    const question = ethers.utils.formatBytes32String(formData.question);
    const answers = Object.keys(formData).reduce((prev, curr, currIndex) => {
      if (curr !== 'question') {
        console.log('prev', prev);
        return [...prev, ethers.utils.formatBytes32String(formData[curr])];
      }

      return prev;
    }, []);

    const address = await signer.getAddress();
    console.log('signer.getAddress()', address);
    const contract = await deployerBallotContract.deploy(question, answers);
    console.log('contract', contract);
    try {
      console.log('contract address', contract.address);
      const d = await contract.deployed();
      setLoading(false);
      setNewBallotContractAddress(contract.address);
      console.log('contract deployed', d);
    } catch (e) {
      console.log('error deploying contract', e);
    }
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, `answer${++indexAnswers}`]);
  };

  const handleDeleteProposal = deletedAnswer => {
    setAnswers([...answers.filter(a => a !== deletedAnswer)]);
  }

  if (!IsConnectedWallet()) {
    return null;
  }

  return (
    <>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)} widths="equal">
          <>
            <Form.Field>
              <Input
                fluid
                placeholder="Why is the sky blue?"
                name="question"
                input={{ ref: register({ required: true }) }}
                label={
                  <Button onClick={handleAddAnswer}>
                    <Button.Content visible>Add answer option</Button.Content>
                  </Button>
                }
                labelPosition="right"
              />
            </Form.Field>
            <hr />
            {answers.map((a) => (
              <Form.Field>
                <Input
                  placeholder="..."
                  name={a}
                  input={{ ref: register({ required: true }) }}
                  label={
                    <Button onClick={() => handleDeleteProposal(a)}>
                      <Button.Content hidden>
                        <Icon name="delete" />
                      </Button.Content>
                    </Button>
                  }
                  labelPosition="right"
                />
              </Form.Field>
            ))}
          </>
          <Form.Field>
            <Button type="submit">Create</Button>
          </Form.Field>
          <Form.Field>
            <Link to="/" className="ui gray small button">
              Cancel
            </Link>
          </Form.Field>
          {newBallotContractAddress && (
            <p>
              You ballot address:{' '}
              <Link to={`/${newBallotContractAddress}`}>
                {newBallotContractAddress}
              </Link>
            </p>
          )}
        </Form>
      </FormProvider>
    </>
  );
}
