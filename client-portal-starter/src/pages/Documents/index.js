import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Container } from "reactstrap";
import MetaTags from "react-meta-tags";

import CardWrapper from "../../components/Common/CardWrapper";
import { fetchDocsStart } from "../../store/documents/actions";
import DocumentsList from "./DocumnetsList";
import DocumentUpload from "./DocumentsUpload";
//i18n
import { withTranslation } from "react-i18next";

function Documents(props) {
  const dispatch = useDispatch();
  const loadDocs = () => {
    dispatch(fetchDocsStart());
  };
  useEffect(() => {
    loadDocs(props.token);

  }, [props.uploading]);

  return (<>
    <div className="page-content">
      <MetaTags>
        <title>{props.t("Documents")}</title>
      </MetaTags>
      <Container>
        <div className="profile mt-5">
          <h1 className="mb-4">
            {props.t("My Documents")}
          </h1>
          <CardWrapper className='mb-5 my-document'>
            <DocumentsList />
          </CardWrapper>
          <h1 className="mb-4">
            {props.t("Upload New Document")}
          </h1>
          <div className="upload-document mb-5">
            <DocumentUpload />
          </div>
        </div>
      </Container>
    </div>
  </>);
}

const mapStateToProps = (state) => ({
  documents: state.documents.documents,
  uploading: state.documents.uploading
});

export default connect(mapStateToProps, null)(withTranslation()(Documents)); 