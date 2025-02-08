from mongoengine import Document, StringField

class Content(Document):
    courseId = StringField(required=True)
    description = StringField(required=True)

    meta = {
        "collection": "contents"
    }