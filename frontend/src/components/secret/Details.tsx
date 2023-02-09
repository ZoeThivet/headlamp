import _ from 'lodash';
import React from 'react';
import { useParams } from 'react-router-dom';
import Secret from '../../lib/k8s/secret';
import { EventsSection } from '../cluster/Overview';
import { DetailsGrid, SecretField } from '../common/Resource';

export default function SecretDetails() {
  const { namespace, name } = useParams<{ namespace: string; name: string }>();

  return (
    <DetailsGrid
      resourceType={Secret}
      name={name}
      namespace={namespace}
      extraInfo={item =>
        item &&
        _.map(item.data, (value, key) => ({
          name: key,
          value: <SecretField value={value} />,
        }))
      }
      sectionsFunc={item => item && <EventsSection />}
    />
  );
}
