/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import web3 from 'web3';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Input,
  Message,
  Segment,
  List,
  Radio,
  Dimmer,
  Loader,
  Progress,
} from 'semantic-ui-react';
import { useLocation, useParams } from 'react-router-dom';
import { FormProvider, useForm, Controller } from 'react-hook-form';
import { useEagerConnect, useContract, useContractCallData } from '../hooks';
import BallotContract from '../contract_build/Ballot2.json';

export default function Ballot() {
  const [question, setQuestion] = useState(null);
  const [proposals, setProposals] = useState(null);
  const [votingStatus, setVotingStatus] = useState(null);
  const [checkedProposal, setCheckedPropsal] = useState(null);
  const [voterStatus, setVoterStatus] = useState(false);
  const [voters, setVoters] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const contract = useContract(BallotContract, params?.address);

  useEffect(async () => {
    // eslint-disable-line
    setLoading(true);
    const tmpQuestion = await contract?.getQuestion();
    const tmpProposals = await contract?.getList();
    const tmpVoitingStatus = await contract?.getVotingStatus();
    const tmpQuestionString = tmpQuestion
      ? web3.utils.toUtf8(tmpQuestion)
      : null;

    setVotingStatus(tmpVoitingStatus);
    setQuestion(tmpQuestionString);
    setProposals(
      tmpProposals?.map((p) => {
        const newProposal = {
          name: web3.utils.toUtf8(p.name),
          id: web3.utils.hexToNumberString(p.id._hex),
          count: web3.utils.hexToNumberString(p.count._hex),
        };
        return newProposal;
      })
    );
    setLoading(false);
  }, [contract, voterStatus]);

  const handleVote = async () => {
    setLoading(true);
    console.log('handleVote');
    const tx = await contract?.vote(checkedProposal);
    console.log('tx', tx);
    await tx.wait();
    setVoterStatus(true);
    setLoading(false);
  };

  const handleShowVoters = async () => {
    setLoading(true);
    console.log('handleShowVoters');
    const voters = await contract?.getVoters();
    setVoters(voters);
    setLoading(false);
  };

  console.log('votingStatus', votingStatus);
  console.log('proposals', proposals);

  const sum = proposals
    ? proposals.reduce((acc, p) => parseInt(p.count) + acc, 0)
    : 0;

  return (
    <>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <Form size="large">
        <h3>{question}</h3>
        {!votingStatus && proposals && (
          <>
            <List>
              {proposals.map((p) => (
                <List.Item key={p.id}>
                  <Radio
                    name="proposal"
                    label={`${p.name}`}
                    value={p.id}
                    onChange={() => setCheckedPropsal(p.id)}
                    checked={p.id === checkedProposal}
                  />
                </List.Item>
              ))}
            </List>
            <Button disable={!checkedProposal} onClick={handleVote}>
              Vote
            </Button>
          </>
        )}
        {!proposals && <span>Not found =(</span>}
        {votingStatus && (
          <>
            {proposals &&
              proposals.map((p) => {
                const percent = 100 / (sum / p.count);
                return (
                  <Progress percent={Math.floor(percent * 100) / 100} progress>
                    {p.name}
                  </Progress>
                );
              })}
            <hr />
            {!voters && <Button onClick={handleShowVoters}>show voters</Button>}
            {voters && (
              <>
                <h4>Voters</h4>
                <List>
                  {voters.map((p) => (
                    <List.Item key={p}>{p}</List.Item>
                  ))}
                </List>
              </>
            )}
          </>
        )}
      </Form>
    </>
  );
}
