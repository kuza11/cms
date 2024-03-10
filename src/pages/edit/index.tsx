import React from 'react';
import dynamic from 'next/dynamic';

const CustomEditor = dynamic( () => {
  return import( '../../components/custom-editor' );
}, { ssr: false } );

function Index() {
  return (
    <CustomEditor
      initialData='<h1></h1>'
    />
  );
}

export default Index;
