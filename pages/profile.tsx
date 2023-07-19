import React, { useState } from 'react';
import Image from 'next/image';
import {
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import getAccessToken from '../utils/getAccessToken';

function Profile() {
  const { user, isLoading, checkSession } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const toggle = () => {
    setShowModal(!showModal);
    setNewName('');
  };
  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setNewName(e.target.value);
  };
  const handleNameSaveClick: React.MouseEventHandler<HTMLButtonElement> = async e => {
    e.preventDefault();

    try {
      const accessToken = await getAccessToken();
      const res = await fetch(`/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ name: newName }, null, 2)
      });

      if (res.ok) {
        checkSession();
        setShowModal(false);
        return;
      }
    } catch (error) {
      document.getElementById('error-msg').textContent = error;
    }
  };
  const handlePasswordChange: (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => React.ChangeEventHandler<HTMLInputElement> = setter => e => {
    setter(e.target.value);
  };
  const handlePasswordSaveClick: React.MouseEventHandler<HTMLButtonElement> = async e => {
    const errMsg = document.getElementById('password-error-msg');

    if (oldPassword === password) {
      errMsg.textContent = 'Your New password cannot be the same as your old password.';
      return;
    }
    if (password !== newPassword) {
      errMsg.textContent = 'Your new passwords do not match.';
      return;
    }
    if (!/^.*[a-z].*$/.test(password)) {
      errMsg.textContent = 'Your password must contain: Lowercase letters (a-z).';
      return;
    }
    if (!/^.*[A-Z].*$/.test(password)) {
      errMsg.textContent = 'Your password must contain: Uppercase letters (A-Z).';
      return;
    }
    if (!/^.*\d.*$/.test(password)) {
      errMsg.textContent = 'Your password must contain: Numbers (0-9).';
      return;
    }
    if (!/^.*[!@#$%^&*].*$/.test(password)) {
      errMsg.textContent = 'Your password must contain: Special characters (e.g. !@#$%^&*).';
      return;
    }
    if (!/^.{8,}$/.test(password)) {
      errMsg.textContent = 'Your password must contain: At least 8 characters.';
      return;
    }

    try {
      setIsProcessing(true);
      const accessToken = await getAccessToken();
      // IMPORTANT: Since there's no endpoint to validate current old password, authentication instead.
      const res = await fetch(`/api/auth/validate`, {
        method: 'POST',
        body: JSON.stringify({ password: oldPassword }, null, 2)
      });
      const data = await res.json();

      if (data.error) {
        errMsg.textContent = 'Your old password is incorrect.';
        return;
      }

      await fetch(`/api/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({ password, connection: 'Username-Password-Authentication' }, null, 2)
      });
      errMsg.textContent = '';
      document.getElementById('password-success-msg').textContent = 'Your password has been reset successfully.';
      setOldPassword('');
      setPassword('');
      setNewPassword('');
    } catch (error) {
      errMsg.textContent = error;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" data-testid="profile">
            <Col md={2}>
              <Image
                src={user.picture}
                width={96}
                height={96}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                decoding="async"
                data-testid="profile-picture"
              />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">
                <span>{user.name}</span>
                <button type="button" className="btn btn-primary ml-3" onClick={toggle}>
                  Change
                </button>
              </h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
            </Col>
          </Row>
          <Row data-testid="profile-json">
            <Col md>
              <h2>Reset Password</h2>
              <Form>
                <FormGroup>
                  <Label for="oldPassword">Old password</Label>
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={handlePasswordChange(setOldPassword)}
                  />
                  <Label for="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    name="password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange(setPassword)}
                  />
                  <Label for="confirmNewPassword">Re-enter new password</Label>
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={newPassword}
                    onChange={handlePasswordChange(setNewPassword)}
                  />
                </FormGroup>
                <Button
                  color="primary"
                  onClick={handlePasswordSaveClick}
                  disabled={!oldPassword || !password || !newPassword || isProcessing}
                >
                  {isProcessing ? 'Processing' : 'Save'}
                </Button>
                <p id="password-error-msg" className="text-danger"></p>
                <p id="password-success-msg" className="text-success"></p>
              </Form>
            </Col>
          </Row>
          {/* Change name modal */}
          <Modal isOpen={showModal} toggle={toggle} backdrop="static">
            <ModalHeader toggle={toggle}>Change Name</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="newName">New Name</Label>
                  <Input id="newName" name="name" type="text" value={newName} onChange={handleNameChange} />
                </FormGroup>
              </Form>
              <p id="error-msg" className="text-danger"></p>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>{' '}
              <Button color="primary" onClick={handleNameSaveClick}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
