from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db import get_session
from app.models import (
    Member,
    MemberBase,
    NewsPost,
    NewsPostBase,
    Page,
    PageBase,
    Publication,
    PublicationBase,
    ResearchArea,
    ResearchAreaBase,
    SiteInfo,
    SiteInfoBase,
)
from app.routers.crud import crud_router

team = crud_router(
    prefix="/team",
    tag="team",
    model=Member,
    create_model=MemberBase,
    order_by=lambda: [Member.order, Member.name],
)

research = crud_router(
    prefix="/research",
    tag="research",
    model=ResearchArea,
    create_model=ResearchAreaBase,
    order_by=lambda: [ResearchArea.order, ResearchArea.title],
)

publications = crud_router(
    prefix="/publications",
    tag="publications",
    model=Publication,
    create_model=PublicationBase,
    order_by=lambda: [Publication.year.desc(), Publication.title],
)

news = crud_router(
    prefix="/news",
    tag="news",
    model=NewsPost,
    create_model=NewsPostBase,
    order_by=lambda: [NewsPost.date.desc()],
)

pages = APIRouter(prefix="/pages", tags=["pages"])


@pages.get("", response_model=list[Page])
def list_pages(session: Session = Depends(get_session)):
    return session.exec(select(Page).order_by(Page.slug)).all()


@pages.get("/{slug}", response_model=Page)
def get_page(slug: str, session: Session = Depends(get_session)):
    page = session.get(Page, slug)
    if page is None:
        raise HTTPException(404, "page not found")
    return page


@pages.put("/{slug}", response_model=Page)
def upsert_page(slug: str, data: PageBase, session: Session = Depends(get_session)):
    page = session.get(Page, slug) or Page(slug=slug, title=data.title)
    page.sqlmodel_update(data.model_dump())
    session.add(page)
    session.commit()
    session.refresh(page)
    return page


@pages.delete("/{slug}", status_code=204)
def delete_page(slug: str, session: Session = Depends(get_session)):
    page = session.get(Page, slug)
    if page is None:
        raise HTTPException(404, "page not found")
    session.delete(page)
    session.commit()


site = APIRouter(prefix="/site", tags=["site"])


@site.get("", response_model=SiteInfo)
def get_site(session: Session = Depends(get_session)):
    return session.get(SiteInfo, 1) or SiteInfo()


@site.put("", response_model=SiteInfo)
def update_site(data: SiteInfoBase, session: Session = Depends(get_session)):
    info = session.get(SiteInfo, 1) or SiteInfo()
    info.sqlmodel_update(data.model_dump())
    session.add(info)
    session.commit()
    session.refresh(info)
    return info


ROUTERS = [site, team, research, publications, news, pages]
