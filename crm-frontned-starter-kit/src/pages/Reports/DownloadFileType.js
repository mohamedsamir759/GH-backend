import React, { useState } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import {  AvForm } from "availity-reactstrap-validation";
import AvFieldSelect from "components/Common/AvFieldSelect";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import useModal from "hooks/useModal";
import { downloadReport } from "apis/reports";

function DownloadFileType({ selectedValues }) {
  const [show, toggle] = useModal();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const fileTypes = [
    "csv", "pdf", "xlsx"
  ];

  return (
    <React.Fragment >
      <div>
        <Button
          color="primary"
          size="sm"
          disabled={!selectedValues.reportType}
          onClick={toggle}
        >
          {t("Download Report")}
        </Button>
      </div>
      <Modal isOpen={show} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle}>
          {t("Download Report")}
        </ModalHeader>
        <ModalBody >
          <AvForm onValidSubmit={async (e, v) => {
            setLoading(true);
            downloadReport({
              ...selectedValues,
              fileType: v.fileType
            }).then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `${selectedValues.reportType}.${v.fileType}`
              );
              document.body.appendChild(link);
              link.click();
              setLoading(false);
            });
          }} >
            <AvFieldSelect
              name="fileType"
              label={t("File Type")}
              options={fileTypes.length > 0
                ? fileTypes.map((type) => {
                  return {
                    value: type,
                    label: type.toUpperCase()
                  };
                }) : ""
              }
              required
            />
            <ModalFooter className="d-flex justify-content-center pb-0">
              <Button type="submit" color="primary" 
                disabled={loading}>
                {loading ? <i className="fa fa-spinner fa-spin" /> : t("Download")}
              </Button>
            </ModalFooter>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment >
  );
}

export default withTranslation()(DownloadFileType);