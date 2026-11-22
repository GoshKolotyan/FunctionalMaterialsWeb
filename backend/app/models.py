"""Content models. `*Base` = editable fields (request body), table class = stored row (response)."""

from datetime import date
from enum import Enum

from sqlalchemy import JSON, Column
from sqlmodel import Field, SQLModel


class MemberGroup(str, Enum):
    pi = "pi"  # lab head, shown as the featured card
    staff = "staff"
    postdoc = "postdoc"
    phd = "phd"
    student = "student"
    assistant = "assistant"
    alumni = "alumni"


class MemberBase(SQLModel):
    name: str
    role: str  # title/position; for alumni — where they are now
    group: MemberGroup = MemberGroup.staff
    education: str = ""
    bio: str = ""
    interests: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    photo: str = ""  # path relative to site root, e.g. "images/team/ivanov.jpg", or full URL
    email: str = ""
    orcid: str = ""  # full ORCID URL
    order: int = 0


class Member(MemberBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class ResearchAreaBase(SQLModel):
    title: str
    summary: str
    image: str = ""
    order: int = 0


class ResearchArea(ResearchAreaBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class PublicationBase(SQLModel):
    title: str
    authors: str  # "A. Author, B. Author" — names matching team members get highlighted
    venue: str = ""
    year: int
    doi: str = ""
    url: str = ""
    featured: bool = False


class Publication(PublicationBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class NewsPostBase(SQLModel):
    slug: str = Field(index=True, unique=True)
    title: str
    date: date
    category: str = "news"  # e.g. news, award, publication, event
    summary: str = ""
    body: str = ""  # Markdown


class NewsPost(NewsPostBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class PageBase(SQLModel):
    title: str
    lead: str = ""  # short intro under the page title
    body: str = ""  # Markdown


class Page(PageBase, table=True):
    """Free-form pages addressed by slug: 'home', 'about', 'contacts'."""

    slug: str = Field(primary_key=True)


class SiteInfoBase(SQLModel):
    name: str = "Functional Materials"
    tagline: str = ""
    description: str = ""
    organization: str = ""
    address: str = ""
    email: str = ""
    phone: str = ""
    hours: str = ""
    facebook: str = ""
    linkedin: str = ""


class SiteInfo(SiteInfoBase, table=True):
    """Single row (id=1) with site-wide contact details used by the header, footer and contacts."""

    id: int | None = Field(default=1, primary_key=True)
